import { User } from '@database/mysql/entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNewUser } from '../interfaces/creat-new-user';
import { UsersServiceAbstract } from '../abstracts/users.service.abstract';

@Injectable()
export class UsersService extends UsersServiceAbstract {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
  ) {
    super();
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepo.findOne({
      where: {
        contact_email: email,
      },
    });

    return user;
  }

  async createNewUser(userInfo: CreateNewUser) {
    const newUser = await this.usersRepo.save({
      username: userInfo.username,
      contact_email: userInfo.email,
      password: userInfo.hashedPassword,
      company_name: '',
    });

    return {
      id: newUser.id,
      username: newUser.username,
      contactEmail: newUser.contact_email,
      company_name: newUser.company_name,
    };
  }
}
