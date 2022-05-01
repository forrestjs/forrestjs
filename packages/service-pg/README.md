# @forrestjs/service-pg

ForrestJS service which keeps a pooled connection to a PostgreSQL database. It's a wrapper around [pg](https://www.npmjs.com/package/pg) library.

## Usage

You can run the `$PG_READY` extension to execute SQL logic at boot time:

```js
const myFeature = {
  target: '$PG_READY',
  handler: async ({ query }) => {
    const res = await query('SELECT NOW()');
    console.log(res.rows);
  },
};
```

Or you can get a reference to the `query` function or the `pool` object from the context:

```js
const myFeature = {
  target: '$START_FEATURE',
  handler: async ({ getContext }) => {
    const query = getContext('pg.query');
    await query('CREATE TABLE IF NOT EXISTS...');
  },
};
```

---

## Configuration

### pg.connectionString

Falls back on env `PGSTRING`.

### pg.exitOnError

Falls back on env `SERVICE_PG_EXIT_ON_ERROR`.

### pg.maxConnections

Falls back on env `SERVICE_PG_MAX_CONNECTIONS`.

### pg.poolConfig

Any configuration that you can give to the library `pg`.

---

## Environment

### PGSTRING

Standard connectivity string for PostgreSQL

```
PGSTRING=postgres://postgres:postgres@localhost:5432/postgres
```

### SERVICE_PG_EXIT_ON_ERROR

If set to `true` the library will crash the project in case connectivity is lost. Default is `false`.

### SERVICE_PG_MAX_CONNECTIONS

Max number of pooled connections to the database server. Default is `10`.
