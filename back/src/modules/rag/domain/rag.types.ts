/** A documentation chunk as authored in `data/*.json`. */
export interface Chunk {
  id: string;
  source: string;
  title?: string;
  section?: string;
  content: string;
}

/** A chunk plus its (L2-normalized) embedding, cached in memory. */
export interface StoredChunk extends Chunk {
  vector: number[];
}

/** A retrieved chunk returned to the client alongside the answer. */
export interface Source {
  id: string;
  source: string;
  title?: string;
  section?: string;
  score: number;
}

/** One chat message exchanged with the model. */
export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/** NDJSON events streamed to the client over POST /api/rag/chat. */
export type RagStreamEvent =
  | { type: 'token'; delta: string }
  | { type: 'done'; sources: Source[] }
  | { type: 'error'; message: string };
