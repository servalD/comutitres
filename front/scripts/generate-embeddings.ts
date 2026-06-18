/**
 * Build-time embedding generator.
 *
 * Reads the manually-curated documentation chunks in `front/docs-chunks/*.json`
 * and produces a single static `front/public/rag/vector_store.json` that Vite
 * copies into `dist/rag/` and nginx serves at runtime.
 *
 * CRITICAL: the embedding model used here MUST match the one used in the browser
 * worker at query time (Xenova/multilingual-e5-small), otherwise cosine
 * similarity between the query vector and these document vectors is meaningless.
 *
 * e5 models expect prefixes: "passage: " for documents, "query: " for queries.
 * Vectors are mean-pooled and L2-normalized, so runtime similarity is a plain
 * dot product.
 */
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { pipeline } from '@huggingface/transformers'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const CHUNKS_DIR = join(ROOT, 'docs-chunks')
const OUT_FILE = join(ROOT, 'public', 'rag', 'vector_store.json')
const MODEL = 'Xenova/multilingual-e5-small'

type Chunk = {
  id: string
  source: string
  title?: string
  section?: string
  content: string
}

type StoredChunk = {
  id: string
  source: string
  title?: string
  section?: string
  text: string
  vector: number[]
}

async function loadChunks(): Promise<Chunk[]> {
  const files = (await readdir(CHUNKS_DIR)).filter((f) => f.endsWith('.json'))
  if (files.length === 0) throw new Error(`No .json chunk files in ${CHUNKS_DIR}`)

  const all: Chunk[] = []
  for (const file of files.sort()) {
    const raw = await readFile(join(CHUNKS_DIR, file), 'utf-8')
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) throw new Error(`${file} must contain a JSON array`)
    for (const c of parsed as Chunk[]) {
      if (!c?.id || !c?.content) {
        throw new Error(`Invalid chunk in ${file}: ${JSON.stringify(c).slice(0, 80)}`)
      }
      all.push(c)
    }
  }

  const ids = new Set<string>()
  for (const c of all) {
    if (ids.has(c.id)) throw new Error(`Duplicate chunk id: ${c.id}`)
    ids.add(c.id)
  }
  return all
}

async function main() {
  const chunks = await loadChunks()
  console.log(`Embedding ${chunks.length} chunks with ${MODEL}…`)

  const extractor = await pipeline('feature-extraction', MODEL)

  const stored: StoredChunk[] = []
  let dimension = 0

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i]
    const input = `passage: ${c.title ? `${c.title}. ` : ''}${c.content}`
    const output = await extractor(input, { pooling: 'mean', normalize: true })
    const vector = Array.from(output.data as Float32Array)
    dimension = vector.length

    stored.push({
      id: c.id,
      source: c.source,
      title: c.title,
      section: c.section,
      text: c.content,
      vector,
    })

    if ((i + 1) % 10 === 0 || i === chunks.length - 1) {
      console.log(`  ${i + 1}/${chunks.length}`)
    }
  }

  const payload = {
    model: MODEL,
    dimension,
    embeddingPrefixes: { query: 'query: ', passage: 'passage: ' },
    createdAt: new Date().toISOString(),
    chunks: stored,
  }

  await mkdir(dirname(OUT_FILE), { recursive: true })
  await writeFile(OUT_FILE, JSON.stringify(payload))
  console.log(`Wrote ${stored.length} vectors (dim=${dimension}) → ${OUT_FILE}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
