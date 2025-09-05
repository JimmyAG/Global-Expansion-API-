import { ServiceDto } from '@app/vendors/dtos/service.dto';
import { ProjectStatus } from '@database/mysql/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEnum,
  IsUUID,
  ValidateNested,
  IsArray,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: "Project's budget", example: 1000.32 })
  @IsNumber({ maxDecimalPlaces: 2 })
  budget: number;

  @ApiProperty({
    description: "Project's country (official country name)",
    example: 'Egypt',
  })
  @IsString()
  country: string;

  @ApiProperty({
    description: "Project's status",
    enum: ProjectStatus,
    example: ProjectStatus.ACTIVE,
  })
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @ApiProperty({
    description: 'A valid uuid v4 that reference the client owning the project',
    example: 'bc21c31c-92cb-49e8-9581-b9ed5ac78603',
  })
  @IsUUID(4)
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({
    description: 'Services needed for this project',
    type: [ServiceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceDto)
  services_needed: ServiceDto[];
}
