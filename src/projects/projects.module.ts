import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Project, User } from '@database/mysql/entities';
import { projectServiceProvider } from './providers/projects.service.provider';
import { ProjectsController } from './projects.controller';
import { MailService } from '@app/mail/mail.service';
import { matchesServiceProvider } from '@app/matches/providers/matches.service.provider';
import { MatchesServiceAbstract } from '@app/matches/abstracts/matches.service.abstract';

@Module({
  imports: [TypeOrmModule.forFeature([User, Project, Match])],
  controllers: [ProjectsController],
  providers: [MailService, projectServiceProvider, matchesServiceProvider],
  exports: [MatchesServiceAbstract],
})
export class ProjectsModule {}
