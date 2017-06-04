import passport from 'passport';
import _ from 'lodash';
import Base from '../baseService';
import config from '../../../config';

class Service extends Base {
  constructor(req, res) {
    super(req, res);
  }

  authenticated() {
    return this.json(this.user);
  }

  logout() {}
}

export default {
  route(router) {
    router.get(
      '/auth0',
      passport.authenticate('auth0', {
        audience: config.auth0.audience,
      })
    );

    router.get(
      config.auth0.callbackUrl,
      passport.authenticate('auth0', {
        session: false
      }),
      (req, res) => {
        return new Service(req, res).authenticated();
      }
    );
  },
};
