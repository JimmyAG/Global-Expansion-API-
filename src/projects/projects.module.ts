import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project, User } from '@database/mysql/entities';
import { projectServiceProvider } from './providers/projects.service.provider';
import { ProjectsController } from './projects.controller';
import { MailService } from '@app/mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project])],
  controllers: [ProjectsController],
  providers: [MailService, projectServiceProvider],
})
export class ProjectsModule {}
