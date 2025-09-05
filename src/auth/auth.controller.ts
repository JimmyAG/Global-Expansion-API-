import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SignInDto } from './dtos/log-in.dto';
import { SignUpDto } from './dtos/sign-up.dto';

@ApiTags('Auth')
@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @Post('/login')
  login(@Body() signInData: SignInDto) {
    return this.authService.login(signInData.email, signInData.password);
  }

  @ApiOperation({ summary: 'User registration' })
  @Post('/signup')
  register(@Body() signUpData: SignUpDto) {
    return this.authService.register(
      signUpData.username,
      signUpData.email,
      signUpData.password,
    );
  }
}
