import Base from './baseCrudHandler';

export default class extends Base {
  constructor() {
    super('Category');
  }

  async typeahead(q = '') {
    return await this.db(this.name)
      .whereRaw('CONTAINS(Name, ?)', q)
      ;
  }
}
