import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { MATCHES_REFRESH_QUEUE } from './match-refresh.processor';

@Injectable()
export class MatchesRefreshScheduler implements OnModuleInit {
  constructor(@InjectQueue(MATCHES_REFRESH_QUEUE) private queue: Queue) {}

  async onModuleInit() {
    await this.queue.upsertJobScheduler(
      'daily-refresh',
      // { pattern: '0 3 * * *' }, // every day at 3:00 AM
      { pattern: '*/1 * * * *' }, // every minute for testing purposes
      {
        name: 'refresh-matches-task',
        opts: {
          removeOnComplete: true,
          removeOnFail: 100,
        },
      },
    );
  }
}
