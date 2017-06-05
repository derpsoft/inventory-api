import _ from 'lodash';
import promisify from 'es6-promisify';
import shortid from 'shortid';
import fs from 'fs';
import s3 from '../providers/aws/s3';
import Base from './baseCrudHandler';

shortid.characters('0123456789ab!defghijklmnopqrst$vwxyzAB@DEFGHIJKLMNOPQRST.VWXYZ-_')

const readFile = promisify(fs.readFile);

export default class extends Base {
  constructor() {
    super('Image');
  }

  async createMany(records) {
    return Promise.all(_.map(records, async record => {
      const image = await readFile(record.imagePath);
      const upload = await s3.uploadAsync(`images/${shortid.generate()}`, image);

      delete record.imagePath;
      record.url = upload.Location;

      return await super.create(record);
    }));
  }
}
