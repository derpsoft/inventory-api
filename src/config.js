import _ from 'lodash';
import URL from 'url';

const nodeEnv = process.env.NODE_ENV || 'development';

const databaseUrl = URL.parse(process.env.DATABASE_URL, true);
const databaseCreds = databaseUrl.auth.split(':', 2);

const redisUrl = URL.parse(process.env.REDIS_URL, true);
const redisCreds = redisUrl.auth.split(':', 2);

const env = {
  // NODE_ENV: JSON.stringify(nodeEnv),
};

_.merge(process.env, env);

const base = {
  env,
  port: process.env.PORT || 8080,
  debug: false,
  app: {
    orderPrefix: '',
  },
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackUrl: process.env.AUTH0_CALLBACK_URL || '/api/v1/auth0/callback',
    audience: process.env.AUTH0_AUDIENCE,
  },
  aws: {
    s3: {
      region: process.env.AWS_REGION || 'us-east-1',
      bucket: process.env.AWS_BUCKET,
    },
  },
  azure: {
    storage: {
      account: process.env.AZURE_BLOB_ACCOUNT || 'telemtest',
      secret: process.env.AZURE_BLOB_SECRET || 'fixme',
      container: process.env.AZURE_BLOB_CONTAINER || 'telemetryhistory',
    },
  },
  db: {
    // connection: process.env.DATABASE_URL,
    connection: {
      host: databaseUrl.hostname,
      server: databaseUrl.hostname,
      user: databaseCreds[0],
      password: databaseCreds[1],
      options: {
        port: parseInt(databaseUrl.port, 10),
        database: databaseUrl.path.split('/')[1],
        trustedConnection: false,
        encrypt: true
      }
    },
  },
  dynamo: {
    region: 'us-east-1',
  },
  redis: {
    connectionString: process.env.REDIS_URL,
    host: redisUrl.hostname,
    port: redisUrl.port,
  },
  stripe: {
    secretKey: '',
  },
};

const pro = _.merge({}, base, {});

const build = _.merge({}, pro, {});

const sta = _.merge({}, pro, {});

const local = _.merge({}, base, {
  debug: true,
  loglevel: 'debug',
});

const dev = _.merge({}, local, {});

const configs = {
  'production': pro,
  'local': local,
  'development': dev,
  'staging': sta,
};

export default configs[nodeEnv];
