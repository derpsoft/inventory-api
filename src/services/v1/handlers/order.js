import shortid from 'shortid';
import Base from './baseCrudHandler';

shortid.characters('0123456789ab!defghijklmnopqrst$vwxyzAB@DEFGHIJKLMNOPQRST.VWXYZ-_')

export default class extends Base {
  constructor() {
    super('Order');
  }

  async generateOrderNumber() {
    return shortid.generate();
  }
  async generateOrderKey() {
    return shortid.generate();
  }

  async singleByNumber(orderNumber) {
    return await this.db(this.name)
      .where({
        orderNumber,
      })
      .first();
  }

  async create(record) {
    record.orderNumber = await this.generateOrderNumber();
    record.orderKey = await this.generateOrderKey();
    return super.create(record);
  }

  toJson(record, prop) {
    if(typeof(record.shippingAddress) !== 'string') {
      record.shippingAddress = JSON.stringify(record.shippingAddress);
    }

  }

  serializeProperties(record) {
    this.toJson(record, 'shippingAddress');

    if(typeof(record.shippingCustomer) !== 'string') {
      record.shippingCustomer = JSON.stringify(record.shippingCustomer);
    }

    if(typeof(record.billingAddress) !== 'string') {
      record.billingAddress = JSON.stringify(record.billingAddress);
    }

    if(typeof(record.billingCustomer) !== 'string') {
      record.billingCustomer = JSON.stringify(record.billingCustomer);
    }
  }

  fromJson(record, prop) {
    if(typeof(record[prop]) === 'string') {
      record[prop] = JSON.parse(record[prop]);
    }
  }

  deserializeProperties(record) {
    this.fromJson(record, 'shippingAddress');
    this.fromJson(record, 'shippingCustomer');

    this.fromJson(record, 'billingAddress');
    this.fromJson(record, 'billingCustomer');
  }

  beforeCreate(record) {
    super.beforeCreate(record);
    this.serializeProperties(record);
  }

  beforeUpdate(record) {
    super.beforeUpdate(record);
    this.serializeProperties(record);
  }

  afterRead(record) {
    super.afterRead(record);
    this.deserializeProperties(record);
  }

  // async singleByKey(orderNumber, orderKey) {
  //   return await this.db(this.name)
  //     .where({
  //       orderNumber,
  //
  //     })
  //     .first();
  // }

  async typeahead(q = '') {
    return await this.db(this.name)
      .whereRaw('CONTAINS(Name, ?)', q)
      ;
  }

  async captureBilling(id, stripeCharge) {

    const result = await this.db(this.name)
      .where('id', id)
      .returning('*')
      .update({
        stripeCharge: stripeCharge,
        paymentMethod: stripeCharge.source.brand,
        paymentMethodId: stripeCharge.source.last4,
        status: 'awaitingShipment',
        billDate: moment().toISOString(),
      });

    return _.first(result);
    /*
    var resp = new Dto<Models.Dto.Order>();
    var order = Handler.Get(request.Id);

    if(null != order && order.Status.EqualsIgnoreCase(OrderStatus.AwaitingPayment)){
      var priceInCents = (int)Math.Round(order.Price * 100, 2, MidpointRounding.AwayFromZero);
      var prefixedOrderNumber = $"{Config.App.OrderPrefix}-{order.OrderNumber}";
      var description = $"Custom order {prefixedOrderNumber}";
      var stripeCharge = StripeHandler.CaptureChargeWithToken(priceInCents, prefixedOrderNumber, request.Token, description);

      order.StripeCharge = stripeCharge;
      order.PaymentMethod = stripeCharge.Source.Brand;
      order.PaymentMethodId = stripeCharge.Source.Last4;
      order.Status = OrderStatus.AwaitingShipment;
      order.BillDate = DateTime.UtcNow;

      Handler.Save(order);
    }

    return resp;
    */
  }
}
