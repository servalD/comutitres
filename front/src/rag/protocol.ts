/**
 * Message protocol + shared constants between the main thread and the RAG worker.
 * Both `src/rag/worker.ts` and the UI component (Étape 3) import from here so the
 * postMessage contract stays type-safe on both ends.
 */

/** Embedding model — MUST match the one used at build time in
 *  `scripts/generate-embeddings.ts`, otherwise similarity is meaningless. */
export const EMBED_MODEL = 'Xenova/multilingual-e5-small'

/** WebLLM model ids (MLC prebuilt list). We pick at runtime based on GPU
 *  capabilities: q4f16 is smaller/faster but needs the `shader-f16` WebGPU
 *  feature (often absent on Intel integrated GPUs); q4f32 is the safe fallback. */
export const LLM_MODEL_F16 = 'Qwen2.5-1.5B-Instruct-q4f16_1-MLC'
export const LLM_MODEL_F32 = 'Qwen2.5-1.5B-Instruct-q4f32_1-MLC'

/** Number of chunks injected into the prompt as context. */
export const TOP_K = 4

/** Static vector store served by nginx (copied from public/ at build). */
export const VECTOR_STORE_URL = '/rag/vector_store.json'

/** Loading phases, in order, used to drive the cold-start progress bar. */
export type LoadPhase = 'vector-store' | 'embedder' | 'llm'

/** A chunk that was retrieved as context for an answer. */
export type RetrievedSource = {
  id: string
  source: string
  title?: string
  section?: string
  score: number
}

/** main thread → worker */
export type MainToWorker =
  | { type: 'init' }
  | { type: 'query'; id: string; question: string }

/** worker → main thread */
export type WorkerToMain =
  | { type: 'progress'; phase: LoadPhase; percent: number; text: string }
  | { type: 'ready' }
  | { type: 'token'; id: string; delta: string }
  | { type: 'answer'; id: string; text: string; sources: RetrievedSource[] }
  | { type: 'error'; id?: string; message: string }
