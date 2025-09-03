import { UsersServiceAbstract } from '@app/users/abstracts/users.service.abstract';
import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UsersServiceAbstract)
    private readonly usersService: UsersServiceAbstract,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('No user found with the provided email');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, email: user.contact_email };
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async register(username: string, email: string, password: string) {
    const existingUser = await this.usersService.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'An account with this email already exist, try signing in instead',
      );
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUserInfo = { username, email, hashedPassword };
    const user = await this.usersService.createNewUser(newUserInfo);

    return {
      message:
        'User was created successfully, you can now log into your account',
      userId: user.id,
    };
  }
}
