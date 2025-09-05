import { Request } from 'express';
// import { User } from '@database/mysql/entities';
import { SanitizedRequestUser } from './sanitized-typeorm-user.type';

export interface RequestWithUser extends Request {
  user: Partial<SanitizedRequestUser>;
}
