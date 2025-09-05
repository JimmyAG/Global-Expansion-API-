import * as yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export interface SeedOptions {
  truncateTables: boolean;
  clientCount: number;
  vendorCount: number;
  superUser?: boolean;
}

export const parseSeedArgs = (): SeedOptions => {
  const argv = yargs(hideBin(process.argv))
    .option('clean-db', {
      alias: 'd',
      type: 'boolean',
      description: 'Truncate all tables for a clean seed',
      default: false,
    })
    .option('client-count', {
      alias: 'c',
      type: 'number',
      description: 'Number of client users to generate',
      default: 1000,
    })
    .option('vendor-count', {
      alias: 'v',
      type: 'number',
      description: 'Number of vendors to generate',
      default: 500,
    })
    .option('super-user', {
      alias: 's',
      type: 'boolean',
      description:
        'Create a super user (will not create any if one already exist)',
      default: false,
    })
    .help()
    .alias('help', 'h')
    .parseSync();

  return {
    truncateTables: argv.cleanDb,
    clientCount: argv.clientCount,
    vendorCount: argv.vendorCount,
    superUser: argv.superUser,
  };
};
