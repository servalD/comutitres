import { Injectable, Logger } from '@nestjs/common';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { MistralClient } from './mistral.client';
import { Chunk, StoredChunk } from '../domain/rag.types';

// At runtime this file lives in dist/modules/rag/infrastructure/, and the chunk
// JSONs are copied (via nest-cli assets) to dist/modules/rag/data/.
const DATA_DIR = join(__dirname, '..', 'data');

function dot(a: number[], b: number[]): number {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

function normalize(v: number[]): number[] {
  const norm = Math.sqrt(dot(v, v)) || 1;
  return v.map((x) => x / norm);
}

/**
 * In-memory vector store. On first use it loads the documentation chunks and
 * embeds them once via Mistral, then serves cosine top-K lookups. The init is
 * memoized; a failed init is not cached, so the next request retries.
 */
@Injectable()
export class VectorStore {
  private readonly logger = new Logger(VectorStore.name);
  private ready: Promise<StoredChunk[]> | null = null;

  constructor(private readonly mistral: MistralClient) {}

  private getStore(): Promise<StoredChunk[]> {
    if (!this.ready) {
      this.ready = this.build().catch((err: unknown) => {
        this.ready = null;
        throw err;
      });
    }
    return this.ready;
  }

  private async build(): Promise<StoredChunk[]> {
    const chunks = await this.loadChunks();
    this.logger.log(`Embedding ${chunks.length} chunks via Mistral…`);
    const inputs = chunks.map((c) =>
      c.title ? `${c.title}. ${c.content}` : c.content,
    );
    const vectors = await this.mistral.embed(inputs);
    this.logger.log(`Vector store ready (${chunks.length} chunks).`);
    return chunks.map((c, i) => ({ ...c, vector: normalize(vectors[i]) }));
  }

  private async loadChunks(): Promise<Chunk[]> {
    const files = (await readdir(DATA_DIR)).filter((f) => f.endsWith('.json'));
    const all: Chunk[] = [];
    for (const file of files.sort()) {
      const parsed = JSON.parse(
        await readFile(join(DATA_DIR, file), 'utf-8'),
      ) as Chunk[];
      for (const c of parsed) {
        if (c?.id && c?.content) all.push(c);
      }
    }
    if (all.length === 0) {
      throw new Error(`Aucun chunk trouvé dans ${DATA_DIR}`);
    }
    return all;
  }

  /** Cosine top-K against the query vector (all vectors are L2-normalized). */
  async search(
    queryVector: number[],
    k: number,
  ): Promise<{ chunk: StoredChunk; score: number }[]> {
    const stored = await this.getStore();
    const q = normalize(queryVector);
    return stored
      .map((chunk) => ({ chunk, score: dot(q, chunk.vector) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, k);
  }
}
