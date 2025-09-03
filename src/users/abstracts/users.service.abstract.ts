import { User } from '@database/mysql/entities';
import { CreateNewUser } from '../interfaces/creat-new-user';

export abstract class UsersServiceAbstract {
  abstract findUserByEmail(email: string): Promise<User | null>;
  abstract createNewUser(userData: CreateNewUser): Promise<{
    id: string;
    username: string;
    contactEmail: string;
  }>;
}
