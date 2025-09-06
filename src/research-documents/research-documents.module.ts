import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ResearchDocumentsController } from './research-documents.controller';
import {
  ResearchDocument,
  ResearchDocumentSchema,
} from '../../database/mongodb/schemas/research-document.schema';
import { researchDocumentsServiceProvider } from './providers/research-document.service.provider';
import { projectServiceProvider } from '@app/projects/providers/projects.service.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@database/mysql/entities';
import { MailService } from '@app/mail/mail.service';
import { MatchesModule } from '@app/matches/matches.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResearchDocument.name, schema: ResearchDocumentSchema },
    ]),
    TypeOrmModule.forFeature([Project]),
    MatchesModule,
  ],
  controllers: [ResearchDocumentsController],
  providers: [
    researchDocumentsServiceProvider,
    projectServiceProvider,
    MailService,
  ],
})
export class ResearchDocumentsModule {}
