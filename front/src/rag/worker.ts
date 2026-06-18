/// <reference lib="webworker" />
/**
 * Edge-AI RAG worker.
 *
 * A *dedicated module Web Worker* (not a Service Worker): we need a long-lived
 * background thread that holds the WebGPU LLM + WASM embedder in memory and keeps
 * heavy compute off the UI thread. Model weights are cached for us — WebLLM uses
 * the Cache Storage API, Transformers.js uses the browser cache — so no Service
 * Worker is needed for offline reuse.
 *
 * Lifecycle:
 *   main → { type: 'init' }                  (load store + embedder + LLM)
 *   worker → { type: 'progress', ... } * N   (cold-start progress)
 *   worker → { type: 'ready' }
 *   main → { type: 'query', id, question }
 *   worker → { type: 'token', id, delta } * N   (streamed)
 *   worker → { type: 'answer', id, text, sources }
 */
import { env, pipeline, type FeatureExtractionPipeline } from '@huggingface/transformers'
import {
  CreateMLCEngine,
  type MLCEngineInterface,
  type ChatCompletionMessageParam,
} from '@mlc-ai/web-llm'
import {
  EMBED_MODEL,
  LLM_MODEL_F16,
  LLM_MODEL_F32,
  TOP_K,
  VECTOR_STORE_URL,
  type LoadPhase,
  type MainToWorker,
  type RetrievedSource,
  type WorkerToMain,
} from './protocol'

// Run the ONNX/WASM embedder single-threaded: avoids requiring SharedArrayBuffer
// (cross-origin isolation), so we don't have to impose COOP/COEP headers that
// would break the app's cross-origin flows. Queries are short — perf is fine.
if (env.backends.onnx?.wasm) env.backends.onnx.wasm.numThreads = 1

// Typed view of the worker global scope (avoids pulling the full webworker lib,
// which clashes with the DOM lib used elsewhere in src/).
const ctx = self as unknown as {
  postMessage: (message: WorkerToMain) => void
  onmessage: ((event: MessageEvent<MainToWorker>) => void) | null
}

type StoredChunk = {
  id: string
  source: string
  title?: string
  section?: string
  text: string
  vector: number[]
}

type VectorStore = {
  model: string
  dimension: number
  embeddingPrefixes: { query: string; passage: string }
  chunks: StoredChunk[]
}

let extractor: FeatureExtractionPipeline | null = null
let engine: MLCEngineInterface | null = null
let store: VectorStore | null = null
let isReady = false

function post(message: WorkerToMain) {
  ctx.postMessage(message)
}

// Each phase maps its 0..1 sub-progress into a slice of the overall 0..100 bar.
// The LLM weights download/compile dominate, hence the widest slice.
const PHASE_RANGE: Record<LoadPhase, [number, number]> = {
  'vector-store': [0, 5],
  embedder: [5, 25],
  llm: [25, 100],
}

function reportProgress(phase: LoadPhase, fraction: number, text: string) {
  const [start, end] = PHASE_RANGE[phase]
  const clamped = Math.max(0, Math.min(1, fraction))
  const percent = Math.min(100, Math.round(start + (end - start) * clamped))
  post({ type: 'progress', phase, percent, text })
}

// Minimal structural WebGPU types (avoids depending on @webgpu/types lib config).
type MinimalAdapter = { features: { has: (name: string) => boolean } }
type MinimalGPU = {
  requestAdapter: (opts?: { powerPreference?: string }) => Promise<MinimalAdapter | null>
}

/**
 * Pre-flight WebGPU check. Returns the LLM model id to load, choosing the f32
 * variant when the GPU lacks `shader-f16` (typical on Intel integrated GPUs).
 * Throws an actionable, localized error when WebGPU is unavailable.
 */
async function selectLlmModel(): Promise<string> {
  const gpu = (navigator as unknown as { gpu?: MinimalGPU }).gpu
  if (!gpu) {
    throw new Error(
      "WebGPU n'est pas disponible dans ce navigateur. Utilisez Chrome/Edge à jour. " +
        'Sous Linux, activez chrome://flags/#enable-unsafe-webgpu puis relancez le navigateur. ' +
        'Diagnostic : https://webgpureport.org',
    )
  }
  const adapter = await gpu.requestAdapter({ powerPreference: 'high-performance' })
  if (!adapter) {
    throw new Error(
      'Aucun GPU compatible WebGPU détecté (un GPU intégré Intel convient une fois WebGPU activé). ' +
        'Sous Linux/Chrome : ouvrez chrome://flags, activez « Unsafe WebGPU Support » et « Vulkan », ' +
        'relancez le navigateur, et vérifiez chrome://gpu (WebGPU doit être « Hardware accelerated »). ' +
        'Test : https://webgpureport.org',
    )
  }
  return adapter.features.has('shader-f16') ? LLM_MODEL_F16 : LLM_MODEL_F32
}

async function init() {
  // 1. Vector store (fast) — fetched first so retrieval is ready when the LLM is.
  reportProgress('vector-store', 0, 'Téléchargement de la base documentaire…')
  const res = await fetch(VECTOR_STORE_URL)
  if (!res.ok) throw new Error(`Échec du chargement de ${VECTOR_STORE_URL} (${res.status})`)
  store = (await res.json()) as VectorStore
  if (store.model !== EMBED_MODEL) {
    throw new Error(
      `Incohérence de modèle : vector_store=${store.model}, runtime=${EMBED_MODEL}`,
    )
  }
  reportProgress('vector-store', 1, `Base chargée (${store.chunks.length} extraits)`)

  // 2. Embedding model (WASM). Single-threaded is fine: queries are short.
  reportProgress('embedder', 0, "Chargement du modèle d'embedding…")
  extractor = await pipeline('feature-extraction', EMBED_MODEL, {
    progress_callback: (p) => {
      if (p.status === 'progress') {
        const pct = Math.round(p.progress ?? 0)
        reportProgress('embedder', pct / 100, `Modèle d'embedding… ${pct}%`)
      }
    },
  })
  reportProgress('embedder', 1, "Modèle d'embedding prêt")

  // 3. LLM (WebGPU). This is the long pole on a cold start.
  reportProgress('llm', 0, 'Vérification du GPU…')
  const llmModel = await selectLlmModel()
  reportProgress('llm', 0, `Chargement du modèle de langage (${llmModel})…`)
  engine = await CreateMLCEngine(llmModel, {
    initProgressCallback: (r) => reportProgress('llm', r.progress, r.text),
  })

  isReady = true
  post({ type: 'ready' })
}

/** Embed the user query (e5 wants the "query: " prefix), normalized. */
async function embedQuery(question: string): Promise<number[]> {
  const prefix = store?.embeddingPrefixes.query ?? 'query: '
  const out = await extractor!(`${prefix}${question}`, { pooling: 'mean', normalize: true })
  return Array.from(out.data as Float32Array)
}

/** Dot product — both query and stored vectors are L2-normalized, so this is
 *  cosine similarity. */
function dot(a: number[], b: number[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i]
  return sum
}

function retrieve(queryVector: number[], k: number) {
  return store!.chunks
    .map((chunk) => ({ chunk, score: dot(queryVector, chunk.vector) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k)
}

function buildMessages(
  question: string,
  hits: { chunk: StoredChunk; score: number }[],
): ChatCompletionMessageParam[] {
  const context = hits
    .map((h, i) => `[Source ${i + 1} — ${h.chunk.title ?? h.chunk.id}]\n${h.chunk.text}`)
    .join('\n\n')

  const system = [
    "Tu es l'assistant virtuel de Comutitres, le service de gestion des titres de transport d'Île-de-France Mobilités.",
    'Réponds en français, de façon claire et concise.',
    'Utilise UNIQUEMENT les informations du CONTEXTE ci-dessous pour répondre.',
    "Si la réponse ne se trouve pas dans le contexte, dis-le explicitement et invite l'utilisateur à contacter le service client ; n'invente jamais d'information.",
    '',
    'CONTEXTE :',
    context,
  ].join('\n')

  return [
    { role: 'system', content: system },
    { role: 'user', content: question },
  ]
}

async function handleQuery(id: string, question: string) {
  const queryVector = await embedQuery(question)
  const hits = retrieve(queryVector, TOP_K)
  const messages = buildMessages(question, hits)

  const completion = await engine!.chat.completions.create({
    messages,
    stream: true,
    temperature: 0.2,
  })

  let full = ''
  for await (const part of completion) {
    const delta = part.choices[0]?.delta?.content ?? ''
    if (delta) {
      full += delta
      post({ type: 'token', id, delta })
    }
  }

  const sources: RetrievedSource[] = hits.map((h) => ({
    id: h.chunk.id,
    source: h.chunk.source,
    title: h.chunk.title,
    section: h.chunk.section,
    score: h.score,
  }))
  post({ type: 'answer', id, text: full, sources })
}

ctx.onmessage = (event: MessageEvent<MainToWorker>) => {
  const message = event.data
  if (message.type === 'init') {
    init().catch((err) =>
      post({ type: 'error', message: err instanceof Error ? err.message : String(err) }),
    )
  } else if (message.type === 'query') {
    if (!isReady) {
      post({ type: 'error', id: message.id, message: "Le moteur n'est pas encore prêt." })
      return
    }
    handleQuery(message.id, message.question).catch((err) =>
      post({
        type: 'error',
        id: message.id,
        message: err instanceof Error ? err.message : String(err),
      }),
    )
  }
}
