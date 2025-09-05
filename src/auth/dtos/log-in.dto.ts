import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignInDto {
  @ApiProperty({
    description: "Valid User's email",
    example: 'professional@email.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({ description: "User's password", example: '$ji)0.sS-32_nz' })
  @IsString()
  @MinLength(8)
  password: string;
}
