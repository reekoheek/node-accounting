# node-koperasi

This is the web application to manage `koperasi` business.
Koperasi is a form of business entity that gather people as investor members, and collect its capital from monthly-basis tuition.


## Quick Start
- Clone this repo.
- Copy `.env.example` to `.env` (duplicate as `.env`). Configure your environment. For configuration, see Environment Variables below.
- Run `npm install` or `yarn install` if you use [Yarn](https://yarnpkg.com/en/).
- Run `npm run start` or `yarn start`.
- Open http://localhost:3000 (if your `PORT` environment variable is not set).

## Environment Variables

### `PORT`
- Application will listen to this port (**Required**).
- Default port is `3000`.

### `SECRET`
- Set secret to encrypt data (**Required**).

### `SETUP_TOKEN`
- Set token for web setup (**Required**).

### `DB_ADAPTER`
- Database engine for application (**Required**).
- Available options are:
  + `mysql`.
  + `disk` (default).

### `DB_FILE`
- **Required** when `DB_ADAPTER` is `disk`.

### `DB_HOST`
- **Required** when `DB_ADAPTER` is `mysql`.
- Default value `localhost`.

### `DB_USER`
- **Required** when `DB_ADAPTER` is `mysql`.
- Default value `root`.

### `DB_PASSWORD`
- **Required** when `DB_ADAPTER` is `mysql`.
- Default value `''`.

### `DB_DATABASE`
- **Required** when `DB_ADAPTER` is `mysql`.
- Default value `node_koperasi`.
