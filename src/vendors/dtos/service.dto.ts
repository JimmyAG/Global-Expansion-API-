import { IsString, IsOptional, IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Service } from '@database/mysql/entities';

export class ServiceDto implements Service {
  @ApiProperty({
    description: 'Service ID',
    example: '7d37c94d-e9ee-47a7-a152-15d8f6be7519',
  })
  @IsUUID(4)
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Service name', example: 'Invoices taxation' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Industry', example: 'Finance' })
  @IsString()
  @IsNotEmpty()
  industry: string;

  @ApiPropertyOptional({ description: 'Service description' })
  @IsString()
  @IsOptional()
  description?: string;
}
