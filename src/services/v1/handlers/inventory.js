import _ from 'lodash';
import moment from 'moment';
import Base from './baseCrudHandler';

export default class extends Base {
  constructor() {
    super('InventoryTransaction');
  }

  async delete() {
    throw new Error('not allowed for InventoryTransactions');
  }
  async update() {
    throw new Error('not allowed for InventoryTransactions');
  }

  async list() {
    const result = await this.db(this.name)
      .select('*');

    _.each(result, x => this.afterRead(x));

    return result;
  }

  async getQuantityOnHand(productId) {}

  beforeCreate(record) {
    delete record.createDate;
    delete record.modifyDate;
    delete record.deleteDate;
    delete record.isDeleted;
    delete record.rowVersion;
    delete record.id;

    delete record.locationId;

    record.createDate = record.modifyDate = moment().toISOString();
    record.transactionType = record.quantity > 0 ? 'In' : 'Out';
  }
}
