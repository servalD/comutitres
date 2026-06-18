import { Injectable } from '@nestjs/common';
import { MistralClient } from '../infrastructure/mistral.client';
import { VectorStore } from '../infrastructure/vector-store';
import {
  ChatMessage,
  RagStreamEvent,
  Source,
  StoredChunk,
} from '../domain/rag.types';

const TOP_K = 6;

@Injectable()
export class RagService {
  constructor(
    private readonly store: VectorStore,
    private readonly mistral: MistralClient,
  ) {}

  /**
   * Retrieve the most relevant chunks for `question`, then stream the model's
   * answer. Yields token events as they arrive, then a final `done` event with
   * the sources that were used.
   */
  async *streamAnswer(
    question: string,
    history: ChatMessage[] = [],
  ): AsyncGenerator<RagStreamEvent> {
    const [queryVector] = await this.mistral.embed([question]);
    const hits = await this.store.search(queryVector, TOP_K);
    const messages = this.buildMessages(
      question,
      history,
      hits.map((h) => h.chunk),
    );

    for await (const delta of this.mistral.streamChat(messages)) {
      yield { type: 'token', delta };
    }

    const sources: Source[] = hits.map((h) => ({
      id: h.chunk.id,
      source: h.chunk.source,
      title: h.chunk.title,
      section: h.chunk.section,
      score: h.score,
    }));
    yield { type: 'done', sources };
  }

  private buildMessages(
    question: string,
    history: ChatMessage[],
    chunks: StoredChunk[],
  ): ChatMessage[] {
    const context = chunks
      .map((c, i) => `[Source ${i + 1} — ${c.title ?? c.id}]\n${c.content}`)
      .join('\n\n');

    const system = [
      "Tu es l'assistant virtuel de Comutitres, le service de gestion des titres de transport d'Île-de-France Mobilités.",
      'Réponds en français, de façon claire et concise.',
      'Utilise UNIQUEMENT les informations du CONTEXTE ci-dessous pour répondre.',
      "Si la réponse ne se trouve pas dans le contexte, dis-le explicitement et invite l'utilisateur à contacter le service client ; n'invente jamais d'information.",
      '',
      'CONTEXTE :',
      context,
    ].join('\n');

    return [
      { role: 'system', content: system },
      ...history,
      { role: 'user', content: question },
    ];
  }
}
