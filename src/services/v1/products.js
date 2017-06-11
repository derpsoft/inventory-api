import BaseCrudService from './baseCrudService';
import Handler from './handlers/product';

const name = 'products';

class Service extends BaseCrudService {
  constructor(...params) {
    super(...params);
  }

  async singleBySku(sku = this.request.params.sku) {
    try {
      const result = await this.handler.singleBySku(sku);
      return this.json({
        endpoint: 'search',
        result,
      });
    } catch (e) {
      return this.error(e);
    }
  }

  async search() {
    try {
      return this.json({
        endpoint: 'search',
      });
    } catch (e) {
      return this.error(e);
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

    router.get(`/${name}/sku/:sku`, (req, res) => factory(req, res).singleBySku());
  }
};
