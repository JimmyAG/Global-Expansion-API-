import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@database/mysql/entities';
import { UsersController } from './controllers/users.controller';
import { userServiceProvider } from './providers/users.service.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [userServiceProvider],
})
export class UsersModule {}
