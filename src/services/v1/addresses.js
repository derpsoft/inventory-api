import BaseCrudService from './baseCrudService';
import Handler from './handlers/address';

const name = 'addresses';

class Service extends BaseCrudService {
  constructor(...params) {
    super(...params);
  }
}

export default {
  route(router) {
    const factory = (req, res) => new Service(req, res, new Handler());
    BaseCrudService.addDefaultRoutes(router, name, factory);
  }
};
