import { registerAs } from '@nestjs/config';

interface AuthConfigType {
  secret: string;
  expiresIn: string;
}

const AuthConfig: AuthConfigType = {
  secret: process.env.JWT_SECRET!,
  expiresIn: process.env.JWT_EXPIRATION || '2d',
};

export default registerAs('auth', () => AuthConfig);
