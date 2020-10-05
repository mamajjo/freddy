import { Bristol } from 'bristol';
import palin from 'palin';
import { env } from './env';

export const logger = new Bristol();
if (true) {
  // BUG: should be checking if env is present... gets undefined
  logger.addTarget('console').withFormatter(palin, {
    rootFolderName: 'freddy' // Edit this to match your actual foldername
  });
}
