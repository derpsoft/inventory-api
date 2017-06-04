import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import passport from 'passport';
import jwt from 'express-jwt';
import jwks from 'jwks-rsa';
import _ from 'lodash';
import winston from 'winston';
import cors from 'cors';
import expressWinston from 'express-winston';
import config from './config';
import {
  default as logger,
  transports
} from './logger';
import apiv1AuthServices from './services/v1/auth';
import apiv1Services from './services/v1';

const app = express();

app.use(expressWinston.logger({
  transports,
  meta: true,
  colorize: true,
  requestWhitelist: ['verb', 'ip', 'ips', 'hostname', 'params'],
}));


app.get('/', (req, res) => {
  res.send('Hello world!');
});

app.use('/api/v1/auth', ((auth) => {
  auth.use(passport.initialize());
  auth.get('/', (req, res) => res.redirect('/api/v1/auth/auth0'));

  return _.reduce(
    apiv1AuthServices,
    (api, service) => {
      service.route(api);
      return api;
    },
    auth);
})(express()));

app.use('/api/v1', ((apiv1) => {
  const tokenGuard = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${config.auth0.domain}/.well-known/jwks.json`,
    }),
    audience: config.auth0.audience,
    issuer: `https://${config.auth0.domain}/`,
    algorithms: ['RS256'],
  });
  apiv1.use(cors());
  apiv1.use(tokenGuard);
  apiv1.use(bodyParser.json());

  return _.reduce(
    apiv1Services,
    (api, service) => {
      service.route(api);
      return api;
    },
    apiv1);
})(express()));

app.use(expressWinston.errorLogger({
  transports,
}));

app.listen(config.port, function() {
  logger.info(`App running in environment config [${process.env.NODE_ENV}] on port ${config.port}`);
});
