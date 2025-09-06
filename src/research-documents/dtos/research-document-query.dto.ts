import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ResearchDocumentQueryDto {
  @ApiPropertyOptional({ description: 'Filter by project ID (UUID v4)' })
  @IsString()
  @IsOptional()
  projectId?: string;

  @ApiPropertyOptional({ description: 'Filter by tag name' })
  @IsString()
  @IsOptional()
  tag?: string;

  @ApiPropertyOptional({ description: 'Filter by content' })
  @IsString()
  @IsOptional()
  text?: string;
}
