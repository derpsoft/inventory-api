import BaseCrudService from './baseCrudService';
import Handler from './handlers/invoice';

const name = 'invoices';

class Service extends BaseCrudService {
  constructor(...params) {
    super(...params);
  }

  async invoice() {}
}

export default {
  route(router) {
    const factory = (req, res) => new Service(req, res, new Handler());
    BaseCrudService.addDefaultRoutes(router, name, factory);

    router.get(
      `/orders/summary/:key/:orderNumber`,
      (req, res) => factory(req,res).invoice()
    );
  }
};
