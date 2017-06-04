import Base from './baseCrudHandler';

export default class Handler extends Base {
  constructor() {
    super('Product');
  }

  async typeahead(q = '') {
    return await this.db(this.name)
      .whereRaw('CONTAINS(Title, ?)', q)
      .orWhereRaw('CONTAINS(Sku, ?)', q)
      ;
  }
}
