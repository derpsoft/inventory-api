import winston from 'winston';
import config from './config';

export const transports = [
  new winston.transports.Console({
    colorize: true,
    level: config.loglevel || 'info',
  }),
];

const logger = new(winston.Logger)({
  transports
});

export default logger;
