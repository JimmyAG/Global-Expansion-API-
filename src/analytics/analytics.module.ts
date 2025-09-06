import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { Project } from '@database/mysql/entities';
import {
  ResearchDocument,
  ResearchDocumentSchema,
} from '@database/mongodb/schemas/research-document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    MongooseModule.forFeature([
      { name: ResearchDocument.name, schema: ResearchDocumentSchema },
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
