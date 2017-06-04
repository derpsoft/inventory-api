import _ from 'lodash';
import moment from 'moment';
import logger from '../../../logger';
import db from '../providers/db';

export default class {
  constructor() {}

  get db() {
    return db;
  }

  async salesByVendor(startDate, endDate, groupBy, vendorId) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }
    if (!vendorId || !_.isNumber(vendorId) || vendorId < 1) {
      throw new Error('vendorId must be >= 1');
    }

    return await this.db('Sale')
      .select(this.db.raw("CAST(MIN([Timestamp]) AS DATE), SUM([Total])"))
      .where(this.db.raw('[Timestamp] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .andWhere('VendorId', vendorId)
      // next line intentionally injects a string
      .groupBy(this.db.raw(`DATEPART(${groupBy}, [Timestamp])`));
  }

  async salesByProduct(startDate, endDate, groupBy, productId) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }
    if (!productId || !_.isNumber(productId) || productId < 1) {
      throw new Error('productId must be >= 1');
    }

    return await this.db('Sale')
      .select(this.db.raw("CAST(MIN([Timestamp]) AS DATE), SUM([Total])"))
      .where(this.db.raw('[Timestamp] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .andWhere('ProductId', productId)
      // next line intentionally injects a string
      .groupBy(this.db.raw(`DATEPART(${groupBy}, [Timestamp])`));
  }

  async salesTotal(startDate, endDate, groupBy) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }

    return await this.db('Sale')
      .select(this.db.raw("CAST(MIN([Timestamp]) AS DATE), SUM([Total])"))
      .where(this.db.raw('[Timestamp] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      // next line intentionally injects a string
      .groupBy(this.db.raw(`DATEPART(${groupBy}, [Timestamp])`));
  }

  async salesByUser(startDate, endDate, userId) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }
    if (!userId || !_.isString(userId)) {
      throw new Error('userId must be provided');
    }

    return await this.db('Order')
      .count('id as result')
      .where('BillByUserAuthId', userId)
      .andWhere(this.db.raw('[BillDate] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .first()
      ;
  }

  async revenueByUser(startDate, endDate, userId) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }
    if (!userId || !_.isString(userId)) {
      throw new Error('userId must be provided');
    }

    return await this.db('Order')
      .sum('price as result')
      .where('BillByUserAuthId', userId)
      .andWhere(this.db.raw('[BillDate] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .first()
      ;
  }

  async listingsTotalByUser(startDate, endDate, userId) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }
    if (!userId || !_.isString(userId)) {
      throw new Error('userId must be provided');
    }

    return await this.db('Order')
      .sum('Price as result')
      .where('BillByUserAuthId', userId)
      .andWhere('Status', 'Pending')
      .andWhere(this.db.raw('[BillDate] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .first()
      ;
  }

  async shippedInventoryByUser(startDate, endDate, userId) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }
    if (!userId || !_.isString(userId)) {
      throw new Error('userId must be provided');
    }

    return await this.db('InventoryTransaction')
      .sum('Quantity as result')
      .where('UserAuthId', userId)
      .andWhere(this.db.raw('[CreateDate] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .andWhere('TransactionType', 'Out')
      .first()
      ;
  }

  async receivedInventoryByUser(startDate, endDate, userId) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }
    if (!userId || !_.isString(userId)) {
      throw new Error('userId must be provided');
    }

    return await this.db('InventoryTransaction')
      .sum('Quantity as result')
      .where('UserAuthId', userId)
      .andWhere(this.db.raw('[CreateDate] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .andWhere('TransactionType', 'In')
      .first()
      ;
  }

  async inventoryDispatched(startDate, endDate, groupBy) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }

    return await this.db('InventoryTransaction')
      .select(this.db.raw("CAST(MIN([CreateDate]) AS DATE), SUM([Quantity])"))
      .where(this.db.raw('[CreateDate] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .andWhere('TransactionType', 'Out')
      // next line intentionally injects a string
      .groupBy(this.db.raw(`DATEPART(${groupBy}, [CreateDate])`));
  }

  async inventoryReceived(startDate, endDate, groupBy) {
    if (!(startDate instanceof moment)) {
      throw new Error('startDate must be an instance of moment');
    }
    if (!(endDate instanceof moment)) {
      throw new Error('endDate must be an instance of moment');
    }
    if (!startDate.isBefore(endDate)) {
      throw new Error('startDate should come before endDate');
    }

    return await this.db('InventoryTransaction')
      .select(this.db.raw("CAST(MIN([CreateDate]) AS DATE), SUM([Quantity])"))
      .where(this.db.raw('[CreateDate] BETWEEN CAST(? AS DATETIME2) AND CAST(? AS DATETIME2)', [startDate.format(), endDate.format()]))
      .andWhere('TransactionType', 'In')
      // next line intentionally injects a string
      .groupBy(this.db.raw(`DATEPART(${groupBy}, [CreateDate])`));
  }

}
