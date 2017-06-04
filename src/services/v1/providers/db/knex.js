import config from '../../../../config';
import logger from '../../../../logger';
import knex from 'knex';
import mssql from 'mssql';

const cfg = {
  client: 'mssql',
  connection: config.db.connection,
  debug: config.debug,
  acquireConnectionTimeout: 3000,
};

const k = knex(cfg)
  // .on('query', (data) => {
  //   logger.info(data);
  // }).on('query-error', (err, data) => {
  //   logger.error(err, data);
  // })
  ;

export default k;
