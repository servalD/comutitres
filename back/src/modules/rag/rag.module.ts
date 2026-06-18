import { Module } from '@nestjs/common';
import { RagService } from './application/rag.service';
import { MistralClient } from './infrastructure/mistral.client';
import { VectorStore } from './infrastructure/vector-store';
import { RagController } from './presentation/rag.controller';

@Module({
  controllers: [RagController],
  providers: [RagService, VectorStore, MistralClient],
})
export class RagModule {}
