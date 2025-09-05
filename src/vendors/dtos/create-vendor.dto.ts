import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { ServiceDto } from './service.dto';
import { Type } from 'class-transformer';

export class CreateVendorDto {
  @ApiProperty({ description: 'The name of the vendor' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: "Vendor's rating", example: 3.5 })
  @IsNumber({ maxDecimalPlaces: 1 })
  rating: number;

  @ApiProperty({ description: "Vendor's response sla", example: 4 })
  @IsNumber()
  response_sla_hours: number;

  @ApiProperty({
    description: "Vendor's supported countries",
    example: ['Egypt', 'Fiji'],
  })
  @IsArray()
  @IsOptional()
  countries_supported: string[];

  @ApiProperty({
    description: 'Services needed for this project',
    type: [ServiceDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @IsOptional()
  @Type(() => ServiceDto)
  services_offered: ServiceDto[];
}
