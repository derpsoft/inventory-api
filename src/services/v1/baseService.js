import winston from 'winston';
import _ from 'lodash';
import logger from '../../logger';
import Cache from './providers/cache/redis';

export default class BaseService {
  request = null
  response = null
  cache = null

  constructor(request, response) {
    this.request = request;
    this.response = response;
    this.cache = new Cache();
  }

  get user() {
    return this.request.user || {};
  }

  get userId() {
    return this.user.sub || 'google|000000000000';
  }

  get logger() {
    return logger;
  }

  get body() {
    return this.request.body;
  }

  db() {
    return Db;
  }

  param(name) {
    return this.request.params[name];
  }

  json(data) {
    return this.response.status(200).json(data);
  }

  error(e, code = 500) {
    logger.error(e);
    return this.response.status(code).json({
      error: e
    });
  }
}
