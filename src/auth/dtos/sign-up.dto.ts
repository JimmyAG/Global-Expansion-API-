import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @ApiProperty({ description: 'Username', example: 'Jimmy_Mo' })
  @IsString()
  username: string;

  @ApiProperty({
    description: 'A valid email format',
    example: 'professional@email.com',
  })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: "User's password", example: '$ji)0.sS-32_nz' })
  @IsString()
  @MinLength(8)
  password: string;
}
