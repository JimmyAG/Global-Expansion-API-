import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateResearchDocumentDto {
  @ApiProperty({
    description: 'A valid uuid v4 that reference the client owning the project',
    example: 'bc21c31c-92cb-49e8-9581-b9ed5ac78603',
  })
  @IsUUID(4)
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Document Title',
    example: 'Market Report',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Document Content',
    example: 'Market Report',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Tags',
    example: ['Egypt', 'Finance', 'Forecast'],
    required: false,
  })
  @IsArray()
  @IsOptional()
  tags?: string[];
}
