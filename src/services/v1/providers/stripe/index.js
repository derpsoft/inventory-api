import stripe from 'stripe';
import config from '../../../../config';
import logger from '../../../../logger';

export default class {
  constructor() {
    const {
      secretKey
    } = config.stripe;

    this.client = stripe(secretKey);
  }


  async captureChargeWithToken(amount, orderNumber, cardToken, description) {
    return await this.client.charges.create({
      amount,
      description,
      source: cardToken,
      currency: 'usd',
      capture: true,
      metadata: {
        orderNumber,
      },
    });
  }
}
