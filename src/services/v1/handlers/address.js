import Base from './baseCrudHandler';

export default class extends Base {
  constructor() {
    super('Address');
  }

  async typeahead(q = '') {
    return await this.db(this.name)
      .whereRaw('CONTAINS(Line1, ?)', q)
      .orWhereRaw('CONTAINS(Line2, ?)', q)
      .orWhereRaw('CONTAINS(City, ?)', q)
      .orWhereRaw('CONTAINS(State, ?)', q)
      .orWhereRaw('CONTAINS(Zip, ?)', q)
      ;
  }
}
