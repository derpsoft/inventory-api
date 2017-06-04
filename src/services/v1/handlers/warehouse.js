import Base from './baseCrudHandler';

export default class Handler extends Base {
  constructor() {
    super('Warehouse');
  }

  async typeahead(q = '') {
    return await this.db(this.name)
      .whereRaw('CONTAINS(Name, ?)', q)
      ;
  }
}
