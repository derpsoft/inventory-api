import Auth0Strategy from 'passport-auth0';
import config from '../../../../config';
import logger from '../../../../logger';

const strategy = new Auth0Strategy({
    domain: config.auth0.domain,
    clientID: config.auth0.clientId,
    clientSecret: config.auth0.clientSecret,
    callbackURL: `/auth${config.auth0.callbackUrl}`,
    audience: config.auth0.audience,
    // scope: 'openid',
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, {
      profile,
      extraParams
    });
  }
);

export default (passport) => {
  passport.use('auth0', strategy);
};
