import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Inject,
  UseGuards,
} from '@nestjs/common';
import { ResearchDocumentsServiceAbstract } from './abstracts/research-documents.service.abstract';
import { CreateResearchDocumentDto } from './dtos/create-research-document.dto';
import { ResearchDocumentQueryDto } from './dtos/research-document-query.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JWTAuthGuard } from '@app/auth/guards/jwt.guard';
import { RolesGuard } from '@app/auth/guards/roles.guard';
import { UserRole } from '@database/mysql/entities';
import { Roles } from '@app/auth/guards/roles.decorator';

@ApiBearerAuth()
@UseGuards(JWTAuthGuard, RolesGuard)
@Controller('research-documents')
export class ResearchDocumentsController {
  constructor(
    @Inject(ResearchDocumentsServiceAbstract)
    private readonly researchDocumentsService: ResearchDocumentsServiceAbstract,
  ) {}

  @Post()
  @Roles(UserRole.CLIENT)
  createDocument(@Body() dto: CreateResearchDocumentDto) {
    return this.researchDocumentsService.createDocument(dto);
  }

  @Get('/search')
  @Roles(UserRole.CLIENT)
  searchDocument(@Query() query: ResearchDocumentQueryDto) {
    return this.researchDocumentsService.searchDocument(query);
  }
}
