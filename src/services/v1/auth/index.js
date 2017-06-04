import _ from 'lodash';
import passport from 'passport';
import Strategies from '../providers/auth';
import Auth0 from './auth0';

_.each(Strategies, strat => strat(passport));

export default [
  Auth0,
];
