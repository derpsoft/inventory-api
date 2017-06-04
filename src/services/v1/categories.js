import BaseCrudService from './baseCrudService';
import Handler from './handlers/category';

const name = 'categories';

class Service extends BaseCrudService {
  constructor(...params) {
    super(...params);
  }

  async create(record = this.request.body) {
    delete record.sort;
    return super.create(record);
  }

  async update(record = this.request.body) {
    delete record.sort;
    return super.update(record);
  }
}

export default {
  route(router) {
    const factory = (req, res) => new Service(req, res, new Handler());
    BaseCrudService.addDefaultRoutes(router, name, factory);
  }
};
