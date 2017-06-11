import Base from './baseCrudHandler';

export default class Handler extends Base {
  constructor() {
    super('Product');
  }

  async singleBySku(sku = '') {
    const record = await this.db(this.name)
      .where({
        sku
      })
      .first();

    this.afterRead(record);

    return record;
  }

  async typeahead(q = '') {
    return await this.db(this.name)
      .whereRaw('CONTAINS(Title, ?)', q)
      .orWhereRaw('CONTAINS(Sku, ?)', q);
  }
}
