import _ from 'lodash';
import moment from 'moment';
import logger from '../../../logger';
import db from '../providers/db';

export default class {
  name = ''

  constructor(name) {
    this.name = name;
    this.logger = logger;
  }

  get db() {
    return db;
  }

  async single(id) {
    const result = await this.db(this.name)
      .where({
        id,
      })
      .limit(1)
      .first();

    this.afterRead(result);

    return result;
  }

  afterRead(record) {
    _.forOwn(record, (v, k, r) => {
      r[_.camelCase(k)] = v;
      delete r[k];
    });
  }

  async list(includeDeleted = undefined) {
    let q = this.db(this.name);

    if(!includeDeleted) {
      q = q.where({
        isDeleted: false,
      });
    }

    const result = await q.select('*');

    _.each(result, x => this.afterRead(x));

    return result;
  }

  async count() {
    return await this.db(this.name)
      .count('id as count')
      .first();
  }

  async create(record) {
    this.beforeCreate(record);

    const now = moment().toISOString();
    let result = await this.db(this.name)
      .returning('*')
      .insert(record);

    result = _.first(result);
    this.afterRead(result);

    return result;
  }

  beforeCreate(record) {
    delete record.createDate;
    delete record.modifyDate;
    delete record.deleteDate;
    delete record.isDeleted;
    delete record.rowVersion;

    record.createDate = record.modifyDate = moment().toISOString();
    record.isDeleted = false;
  }

  async update(id, changes) {
    this.beforeUpdate(changes);

    let result = await this.db(this.name)
      .where('id', id)
      .returning('*')
      .update(changes);

    result = _.first(result);
    this.afterRead(result);

    return result;
  }

  beforeUpdate(record) {
    delete record.createDate;
    delete record.modifyDate;
    delete record.deleteDate;
    delete record.isDeleted;
    delete record.rowVersion;

    record.modifyDate = moment().toISOString();
  }

  async delete(id) {
    await this.db(this.name)
      .where('id', id)
      .update({
        isDeleted: true,
        deleteDate: moment().toISOString(),
      });

    return true;
  }

  async restore(id) {
    await this.db(this.name)
      .where('id', id)
      .update({
        isDeleted: false,
        deleteDate: null,
        modifyDate: moment().toISOString(),
      });

    return true;
  }
}
