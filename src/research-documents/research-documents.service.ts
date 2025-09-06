import { FilterQuery, Model } from 'mongoose';
import { ResearchDocumentQueryDto } from './dtos/research-document-query.dto';
import {
  ResearchDocument,
  ResearchDocumentDocument,
} from '@database/mongodb/schemas/research-document.schema';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ResearchDocumentsServiceAbstract } from './abstracts/research-documents.service.abstract';
import { CreateResearchDocument } from './interfaces/create-new-document.interface';
import { ProjectsServiceAbstract } from '@app/projects/abstracts/projects.service.abstract';

@Injectable()
export class ResearchDocumentsService extends ResearchDocumentsServiceAbstract {
  constructor(
    @InjectModel(ResearchDocument.name)
    private documentModel: Model<ResearchDocumentDocument>,
    @Inject(ProjectsServiceAbstract)
    private readonly projectsService: ProjectsServiceAbstract,
  ) {
    super();
  }

  async createDocument(dto: CreateResearchDocument) {
    const projectExists = await this.projectsService.findProjectsById(
      dto.projectId,
    );

    if (!projectExists) throw new NotFoundException("Project doesn't exist");

    const doc = new this.documentModel(dto);

    return await doc.save();
  }

  async searchDocument(
    query: ResearchDocumentQueryDto,
  ): Promise<ResearchDocument[]> {
    const filter: FilterQuery<ResearchDocumentDocument> = {};

    if (query.projectId) {
      filter.projectId = query.projectId;
    }

    if (query.tag) {
      filter.tags = query.tag;
    }

    if (query.text) {
      filter.$text = { $search: query.text };
    }

    return await this.documentModel.find(filter).lean().exec();
  }
}
