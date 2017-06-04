import Db from '../../../providers/db';
import config from '../../../config';
import {
  default as logger,
} from '../../../logger';

export default class Base {

  constructor(name) {
    this.name = name;
  }

  get config() {
    return config;
  }

  get logger() {
    return logger;
  }

  db() {
    return Db;
  }

  run() {
    throw new Error('Subclass must override Worker#run');
  }
}
