import Pool from 'pg-pool';
import config from '../../../../config';
import logger from '../../../../logger';

const pool = new Pool(config.postgres);

// attach an error handler to the pool for when a connected, idle client
// receives an error by being disconnected, etc
pool.on('error', (e, client) => {
  logger.error(e);
  // handle this in the same way you would treat process.on('uncaughtException')
  // it is supplied the error as well as the idle client which received the error
});

export default pool;
