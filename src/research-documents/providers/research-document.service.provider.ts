import { ResearchDocumentsServiceAbstract } from '../abstracts/research-documents.service.abstract';
import { ResearchDocumentsService } from '../research-documents.service';

export const researchDocumentsServiceProvider = {
  provide: ResearchDocumentsServiceAbstract,
  useClass: ResearchDocumentsService,
};
