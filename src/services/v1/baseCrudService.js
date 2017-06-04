import winston from 'winston';
import _ from 'lodash';
import logger from '../../logger';
import Cache from './providers/cache/redis';
import Base from './baseService';

export default class BaseCrudService extends Base {
  handler = null

  constructor(request, response, handler) {
    super(request, response);

    this.handler = handler;
  }

  async single(id = this.request.params.id) {
    try {
      const result = await this.handler.single(id);

      await this.json({
        endpoint: 'single',
        result,
      });
    } catch (e) {
      await this.error(e);
    }
  }

  async list() {
    try {
      const includeDeleted = this.request.query.includeDeleted === 'true';
      const result = await this.handler.list(includeDeleted);
      await this.json({
        endpoint: 'list',
        result,
      });
    } catch (e) {
      await this.error(e);
    }
  }

  async count() {
    try {
      const {
        count
      } = await this.handler.count();
      await this.json({
        endpoint: 'count',
        result: count,
      });
    } catch (e) {
      await this.error(e);
    }
  }

  async typeahead() {
    try {
      const includeDeleted = this.request.query.includeDeleted === 'true';
      const result = await this.handler.typeahead(includeDeleted);
      await this.json({
        endpoint: 'typeahead',
        result,
      });
    } catch (e) {
      await this.error(e);
    }
  }

  async create(record = this.request.body) {
    try {
      const result = await this.handler.create(record);
      return await this.json({
        endpoint: 'create',
        result,
      });
    } catch (e) {
      return await this.error(e);
    }
  }

  async update(record = this.request.body) {
    const {
      id
    } = this.request.params;

    try {
      const result = await this.handler.update(id, record);

      await this.json({
        endpoint: 'update',
        result,
      });
    } catch (e) {
      await this.error(e);
    }
  }

  async delete() {
    const {
      id
    } = this.request.params;
    try {
      const result = await this.handler.delete(id);

      await this.json({
        endpoint: 'delete',
        result,
      });
    } catch (e) {
      await this.error(e);
    }
  }

  async restore() {
    const {
      id
    } = this.request.params;
    try {
      const result = await this.handler.restore(id);

      await this.json({
        endpoint: 'restore',
        result,
      });
    } catch (e) {
      await this.error(e);
    }
  }

  static addDefaultRoutes(router, name, serviceFactory) {
    router.get(`/${name}`, (req, res) => {
      return serviceFactory(req, res).list();
    });

    router.get(`/${name}/count`, (req, res) => {
      return serviceFactory(req, res).count();
    });

    router.get(`/${name}/typeahead`, (req, res) => {
      return serviceFactory(req, res).typeahead();
    });

    router.post(`/${name}/save`, (req, res) => {
      return serviceFactory(req, res).create();
    });
    router.post(`/${name}`, (req, res) => {
      return serviceFactory(req, res).create();
    });

    router.get(`/${name}/:id`, (req, res) => {
      return serviceFactory(req, res).single();
    });

    router.put(`/${name}/:id`, (req, res) => {
      return serviceFactory(req, res).update();
    });

    router.delete(`/${name}/:id`, (req, res) => {
      return serviceFactory(req, res).delete();
    });
    router.post(`/${name}/:id/restore`, (req, res) => {
      return serviceFactory(req, res).restore();
    })
  }
}
