import _ from 'lodash';
import BaseCrudService from './baseCrudService';
import Handler from './handlers/order';
import Offers from './handlers/offer';
import Stripe from './providers/stripe';
import math from 'mathjs';

const name = 'orders';
const TAX_RATE = 0.0925;

class Service extends BaseCrudService {
  constructor(...params) {
    super(...params);

    this.stripe = new Stripe();
    this.offers = new Offers();
  }

  async single() {
    const {
      id
    } = this.request.params;

    try {
      const result = await this.handler.single(id);
      result.offers = await this.offers.listByOrder(id);
      return this.json({
        endpoint: 'single',
        result,
      });
    } catch (e) {
      return this.error(e);
    }
  }

  async create(record = this.request.body) {
    try {
      const offers = _.map(record.offers, (x) => {
        delete x.product;
        return x;
      });;
      delete record.offers;

      const subtotal = _.sumBy(offers, x => x.price * x.quantity);
      const tax = subtotal * TAX_RATE;
      const total = math.round(subtotal + tax, 2);
      const order = {
        ...record,
        billByUserAuthId: this.userId,
        orderNumber: '',
        price: total,
        priceCurrency: 'usd',
        status: 'awaitingPayment',
      };

      delete order.merchant;

      const result = await this.handler.create(order);
      result.offers = await this.offers.createMany(result.id, offers);

      this.json({
        endpoint: 'create',
        result,
      });
    } catch (e) {
      return this.error(e);
    }
  }

  async update(id = this.request.params.id, record = this.request.body) {
    try {
      const offers = _.map(record.offers, (x) => {
        delete x.product;
        return x;
      });;
      delete record.offers;

      const subtotal = _.sumBy(offers, x => x.price * x.quantity);
      const tax = subtotal * TAX_RATE;
      const total = math.round(subtotal + tax, 2);
      const order = {
        ...record,
        price: total,
      };

      delete order.merchant;

      const result = await this.handler.update(id, order);
      result.offers = await this.offers.updateMany(result.id, offers);

      this.json({
        endpoint: 'update',
        result,
      });
    } catch (e) {
      return this.error(e);
    }
  }

  async captureBilling() {
    const {
      id
    } = this.request.params;
    const {
      token
    } = this.request.body;

    try {
      const order = await this.handler.single(id);
      const priceInCents = math.round(order.Price * 100, 2);
      const prefixedOrderNumber = `${config.app.orderPrefix}-${order.orderNumber}`;
      const description = `Custom order ${prefixedOrderNumber}`;

      const charge = await this.stripe.captureChargeWithToken(priceInCents, prefixedOrderNumber, cardToken, description);
      const result = await this.handler.captureBilling(id, charge);

      return this.json({
        endpoint: 'captureBilling',
        result,
      });
    } catch (e) {
      return this.error(e);
    }
  }

  async shipped() {
    const {
      id
    } = this.request.params;

    try {
      const order = await this.handler.single(id);

      if (order.status !== 'awaitingShipment') {
        throw new Error('order not ready for shipment');
      }

      const result = await this.handler.update(id, {
        shipByUserAuthId: this.userId,
        status: 'shipped',
        shipDate: moment().toISOString(),
      });

      return this.json({
        endpoint: 'shipped',
        result,
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

    router.post(`/${name}/:id/billing`, (req, res) => factory(req, res).captureBilling());
    router.post(`/${name}/:id/shipped`, (req, res) => factory(req, res).shipped());
  }
};
