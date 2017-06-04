import BaseCrudService from './baseCrudService';
import Handler from './handlers/product';

const name = 'products';

class Service extends BaseCrudService {
  constructor(...params) {
    super(...params);
  }

  async search() {
    try {
      await this.json({
        endpoint: 'search',
      });
    } catch (e) {
      await this.error(e);
    }
  }
}

export default {
  route(router) {
    const factory = (req, res) => new Service(req, res, new Handler());
    BaseCrudService.addDefaultRoutes(router, name, factory);

    router.post(`/${name}/search`, (req, res) => {
      factory(req, res).search();
    });
  }
};
