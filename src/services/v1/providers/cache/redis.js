import Base from './base';
import redis from 'redis';
import config from '../../../../config';
import logger from '../../../../logger';

const client = redis.createClient(config.redis.connectionString);
client.on('error', (e) => logger.error(e));

export default class RedisCache extends Base {
  constructor() {
    super();
  }

  async get(key) {
    return await this._get(key);
  }

  _get(key) {
    return new Promise((resolve, reject) => {
      client.get(key, (e, data) => {
        if (e) {
          return reject(e);
        }
        resolve(this.deserialize(data));
      });
    });
  }

  async getMany(keys = []) {
    return await this._getMany(keys);
  }

  _getMany(keys) {
    return new Promise((resolve, reject) => {
      client.mget(keys, (e, data) => {
        if (e) {
          return reject(e);
        }
        resolve(data.map(this.deserialize));
      });
    });
  }

  async set(key, value) {
    await this._set(key, value);
  }

  _set(key, value) {
    return new Promise((resolve, reject) => {
      client.set(key, this.serialize(value), (e, data) => {
        if (e) {
          return reject(e);
        }
        resolve(data);
      });
    });
  }

  async lpush(key, value) {
    await this._lpush(key,value);
  }

  _lpush(key, value) {
    return new Promise((resolve, reject) => {
      client.lpush(key, this.serialize(value), (e, data) => {
        if (e) {
          return reject(e);
        }
        resolve(data);
      });
    });
  }

  async ltrim(key) {
    await this._ltrim(key, 120);
  }

  _ltrim(key, count) {
    return new Promise((resolve, reject) => {
      client.ltrim(key, 0, count, (e, data) => {
        if (e) {
          return reject(e);
        }
        resolve(data);
      });
    });
  }

  async lrange(key) {
    return this._lrange(key);
  }

  _lrange(key) {
    return new Promise((resolve, reject) => {
      client.lrange(key, 0, 30, (e, data) => {
        if (e) {
          return reject(e);
        }
        resolve(data);
      });
    });
  }

  serialize(obj) {
    if (typeof obj === 'string') {
      return obj;
    }

    return JSON.stringify(obj);
  }
  deserialize(str) {
    // if()
    return JSON.parse(str);
  }
}
