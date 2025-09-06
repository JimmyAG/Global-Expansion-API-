import { registerAs } from '@nestjs/config';
import { QueueOptions } from 'bullmq';

export default registerAs(
  'bullmq',
  (): QueueOptions => ({
    connection: {
      host:
        process.env.NODE_ENV === 'docker'
          ? 'redis'
          : process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD || undefined,
    },
    defaultJobOptions: {
      attempts: 5,
      removeOnComplete: 200,
      removeOnFail: 1000,
    },
  }),
);
