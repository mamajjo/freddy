import { Bristol } from 'bristol';
import palin from 'palin';
import { env } from './env';

export const logger = new Bristol();

if (env && env.LOG_LEVEL !== 'off') {
  logger.addTarget('console').withFormatter(palin, {
    rootFolderName: 'freddy'
  });
}
