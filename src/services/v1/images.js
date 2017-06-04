import formidable from 'formidable';
import BaseCrudService from './baseCrudService';
import Handler from './handlers/image';

const name = 'images';

class Service extends BaseCrudService {
  constructor(...params) {
    super(...params);
  }

  async create() {
    const form = formidable.IncomingForm();

    form.parse(this.request, async(err, fields, files) => {
      try {
        const images = _.map(files, (f) => {

        });
        const result = await this.handler.createMany(images);

        await this.json({
          endpoint: 'create',
          result,
        });
      } catch (e) {
        await this.error(e);
      }
    });
  }
}

export default {
  route(router) {
    const factory = (req, res) => new Service(req, res, new Handler());
    BaseCrudService.addDefaultRoutes(router, name, factory);
  }
};
