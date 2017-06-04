import _ from 'lodash';
import {
  S3,
  Config,
} from 'aws-sdk';
import moment from 'moment';
import config from '../../../../config';
import logger from '../../../../logger';

const s3 = new S3({
  region: config.aws.s3.region,
  params: {
    Bucket: config.aws.s3.bucket,
  }
});
const ACL = 'public-read';
const CacheControl = 'max-age=7200';
const ContentType = 'image/jpeg';

export default class Provider {
  static uploadAsync(Key, Body) {
    return new Promise((resolve, reject) => s3.upload({
      Key,
      Body,
      ACL,
      CacheControl,
      ContentType,
    }, (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data);
    }));
  }
};
