# NodeJS Api Boilerplate

Boilerplate for a NodeJS API than includes
- Express
- Babel
- Auth0/JWT/JWKS for authentication
- Postgresql for data storage
- Redis for caching
- Winston for logging
- S3 for image uploads
- Path versioning for endpoints

Intended to run on Heroku, but works fine elsewhere.

## Prereqs

- Auth0 account (free is fine)
- `nvm`
- `yarn`

## Setup

- `nvm use || nvm install`
- `yarn install`

Create a .env file at the project root that contains the following:

```
NODE_ENV=local
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
DATABASE_URL=
REDIS_URL=
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
```

> Don't forget to actually set the things!

Then open up ~/src/config.js and make adjustments to the configuration as appropriate.

## Run

### Development

- Start the webpack watcher/compiler with `yarn run dev`
- Start a development server with `yarn run dev-server`
- Run workers in development mode with `yarn run dev-workers`


### Production

- Build with `yarn run build`
- Run prod server with `node dist/index`
- Run prod workers with `node dist/services/v1/workers/index`

### Heroku

- There's already a `Procfile`.
- `heroku local` should work just fine.
- No need to specify a buildpack if not running additional languages.
