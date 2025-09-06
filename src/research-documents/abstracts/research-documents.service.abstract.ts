import {
  ResearchDocument,
  ResearchDocumentDocument,
} from '@database/mongodb/schemas/research-document.schema';
import { CreateResearchDocumentDto } from '../dtos/create-research-document.dto';
import { ResearchDocumentQuery } from '../interfaces/research-document-query.interface';

export abstract class ResearchDocumentsServiceAbstract {
  abstract createDocument(
    dto: CreateResearchDocumentDto,
  ): Promise<ResearchDocumentDocument>;

  abstract searchDocument(
    query: ResearchDocumentQuery,
  ): Promise<ResearchDocument[]>;
}
