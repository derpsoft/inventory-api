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

  async getQuantityOnHand(productId) {}

  async save(request) {
    if(!request) {
      throw new Error('request is required')
    }
    if(request.productId < 1) {
      throw new Error('productId must be set');
    }
    if(!request.userAuthId) {
      throw new Error('userAuthId must be set');
    }

    delete request.id;
    request.TransactionType = request.Quantity > 0 ? 'In' : 'Out';

    return await this.db('InventoryTransaction')
      .insert(request);
  }
}
