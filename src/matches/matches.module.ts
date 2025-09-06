import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match, Project } from '@database/mysql/entities';
import { matchesServiceProvider } from './providers/matches.service.provider';
import { MatchesServiceAbstract } from './abstracts/matches.service.abstract';
import { MailService } from '@app/mail/mail.service';
import { BullModule } from '@nestjs/bullmq';
import {
  MATCHES_REFRESH_QUEUE,
  MatchesRefreshProcessor,
} from '@app/bullmq/match-refresh.processor';
import { MatchesRefreshScheduler } from '@app/bullmq/match-refresh.scheduler';

@Module({
  imports: [
    BullModule.registerQueue({
      name: MATCHES_REFRESH_QUEUE,
    }),
    TypeOrmModule.forFeature([Match, Project]),
  ],
  providers: [
    matchesServiceProvider,
    MatchesRefreshProcessor,
    MatchesRefreshScheduler,
    MailService,
  ],
  exports: [MatchesServiceAbstract],
})
export class MatchesModule {}
