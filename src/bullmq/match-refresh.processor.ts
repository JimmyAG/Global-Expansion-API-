/* eslint-disable @typescript-eslint/no-explicit-any */
import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { MatchesServiceAbstract } from '@app/matches/abstracts/matches.service.abstract';

export const MATCHES_REFRESH_QUEUE = 'matches-refresh';

@Injectable()
@Processor(MATCHES_REFRESH_QUEUE, { concurrency: 1 })
export class MatchesRefreshProcessor extends WorkerHost {
  private readonly logger = new Logger(MatchesRefreshProcessor.name);

  constructor(
    @Inject(MatchesServiceAbstract)
    private readonly matchesService: MatchesServiceAbstract,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<unknown> {
    this.logger.log(`Processing job ${job.id}...`);

    await this.matchesService.refreshMatches();

    return { status: 'ok' };
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job) {
    this.logger.log(`Job ${job.id} completed`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job, err: any) {
    this.logger.error(`Job ${job.id} failed: ${err.message}`, err.stack);
  }
}
