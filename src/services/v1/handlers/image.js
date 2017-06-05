import shortid from 'shortid';
import s3 from '../providers/aws/s3';
import Base from './baseCrudHandler';

shortid.characters('0123456789ab!defghijklmnopqrst$vwxyzAB@DEFGHIJKLMNOPQRST.VWXYZ-_')

export default class extends Base {
  constructor() {
    super('Image');
  }

  async createMany(records) {
    return _.map(records, async record => {
      const {
        image
      } = record;
      const upload = await s3.uploadAsync(`images/${shortid.generate()}`, image);
      delete record.image;
      return await super.create(record);
    });
  }
}
