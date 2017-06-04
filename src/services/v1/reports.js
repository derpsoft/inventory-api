import moment from 'moment';
import Base from './baseService';
import Handler from './handlers/report';

const name = 'reports';

class Service extends Base {
  handler = null

  constructor(req, res, handler) {
    super(req, res);
    this.handler = handler;
  }

  async salesByVendor() {
    const {
      startDate,
      endDate,
      groupBy = 'day',
      vendorId
    } = this.request.query;

    const id = parseInt(vendorId, 10);
    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const result = await this.handler.salesByVendor(start, end, groupBy, id);
      return this.json({
        endpoint: 'salesByVendor',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async salesByProduct() {
    const {
      startDate,
      endDate,
      groupBy = 'day',
      productId
    } = this.request.query;

    const id = parseInt(productId, 10);
    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const result = await this.handler.salesByProduct(start, end, groupBy, id);
      return this.json({
        endpoint: 'salesByVendor',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async salesTotal() {
    const {
      startDate,
      endDate,
      groupBy = 'day',
    } = this.request.query;

    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const result = await this.handler.salesTotal(start, end, groupBy);
      return this.json({
        endpoint: 'salesTotal',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async salesByUser() {
    const {
      startDate,
      endDate,
    } = this.request.query;

    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const {
        result
      } = await this.handler.salesByUser(start, end, this.userId);

      return this.json({
        endpoint: 'salesByUser',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async revenueByUser() {
    const {
      startDate,
      endDate,
    } = this.request.query;

    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const {
        result
      } = await this.handler.revenueByUser(start, end, this.userId);

      return this.json({
        endpoint: 'revenueByUser',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async listingsTotalByUser() {
    const {
      startDate,
      endDate,
    } = this.request.query;

    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const {
        result
      } = await this.handler.listingsTotalByUser(start, end, this.userId);

      return this.json({
        endpoint: 'listingsTotalByUser',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async shippedInventoryByUser() {
    const {
      startDate,
      endDate,
    } = this.request.query;

    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const {
        result
      } = await this.handler.shippedInventoryByUser(start, end, this.userId);

      return this.json({
        endpoint: 'shippedInventoryByUser',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async receivedInventoryByUser() {
    const {
      startDate,
      endDate,
    } = this.request.query;

    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const {
        result
      } = await this.handler.receivedInventoryByUser(start, end, this.userId);

      return this.json({
        endpoint: 'receivedInventoryByUser',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async inventoryDispatched() {
    const {
      startDate,
      endDate,
      groupBy = 'day',
    } = this.request.query;

    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const result = await this.handler.inventoryDispatched(start, end, groupBy);
      return this.json({
        endpoint: 'inventoryDispatched',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

  async inventoryReceived() {
    const {
      startDate,
      endDate,
      groupBy = 'day',
    } = this.request.query;

    const start = moment(startDate || {}).subtract(7, 'days');
    const end = moment(endDate || {});

    try {
      const result = await this.handler.inventoryReceived(start, end, groupBy);
      return this.json({
        endpoint: 'inventoryReceived',
        result,
      })
    } catch (e) {
      return this.error(e);
    }
  }

}

export default {
  route(router) {
    const factory = (req, res) => new Service(req, res, new Handler());

    router.get('/reports/salesByVendor', (req, res) => factory(req, res).salesByVendor());
    router.get('/reports/salesByProduct', (req, res) => factory(req, res).salesByProduct());
    router.get('/reports/salesByTotal', (req, res) => factory(req, res).salesTotal());
    router.get('/reports/inventoryDispatched', (req, res) => factory(req, res).inventoryDispatched());
    router.get('/reports/inventoryReceived', (req, res) => factory(req, res).inventoryReceived());

    router.get('/reports/scalar/salesByUser', (req, res) => factory(req, res).salesByUser());
    router.get('/reports/scalar/revenueByUser', (req, res) => factory(req, res).revenueByUser());
    router.get('/reports/scalar/listingsTotalByUser', (req, res) => factory(req, res).listingsTotalByUser());
    router.get('/reports/scalar/shippedInventoryByUser', (req, res) => factory(req, res).shippedInventoryByUser());
    router.get('/reports/scalar/receivedInventoryByUser', (req, res) => factory(req, res).receivedInventoryByUser());
  }
};
