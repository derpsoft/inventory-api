import BaseCrudService from './baseCrudService';
import Handler from './handlers/inventory';

const name = 'inventory-transactions';

class Service extends BaseCrudService {
  constructor(...params) {
    super(...params);
  }

  async update() {
    this.error(new Error('not supported'));
  }
  async delete() {
    this.error(new Error('not supported'));
  }
}

export default {
  route(router) {
    const factory = (req, res) => new Service(req, res, new Handler());
    BaseCrudService.addDefaultRoutes(router, name, factory);
  }
};
