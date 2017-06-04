import _ from 'lodash';
import moment from 'moment';
import Base from './baseCrudHandler';

export default class extends Base {
  constructor() {
    super('Offer');
  }

  beforeCreate(record) {
    record.createDate = record.modifyDate = moment().toISOString();
  }

  async listByOrder(orderId) {
    const result = await this.db(this.name)
      .where({
        orderId
      });

    _.each(result, x => this.afterRead(x));

    return result;
  }

  async create(orderId, offer) {
    offer.orderId = orderId;
    return super.create(offer);
  }

  async createMany(orderId, offers) {
    const now = moment().toISOString();
    offers = _.map(offers, x => {
      const offer = {
        ...x,
        orderId,
      };

      this.beforeCreate(offer);

      return offer;
    });

    const result = await this.db(this.name)
      .returning('*')
      .insert(offers);

    _.each(result, x => this.afterRead(x));

    return result;
  }

  async updateMany(orderId, offers) {
    const now = moment().toISOString();
    const result = await Promise.all(_.map(offers, async x => {
      const offer = {
        ...x,
        orderId,
      };

      this.beforeUpdate(offer);
      delete offer.id;

      return await this.db(this.name)
        .returning('*')
        .where('id', x.id)
        .update(offer);
    }));

    _.each(result, x => this.afterRead(x));

    return result;
  }
}
