<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Connect to Postgres as a Service</h1>

[My First REST API](../README.md) &raquo; [Connect to Postgres as a Service](./README.md)

---

# Connect to Postgres as a Service

Let's step up the game a little bit and try to use a real database. In this tutorial we will create a service that connects to a PostgreSQL database, and offers an interface towards the App's features to run custom queries.

> Why a service?

I'm glad you asked 😎!

Setting up a connection to a db is not really a "business logic". It's more of a infrastructural responsibility that may be easily shared across different Apps.
A service is the best match for this kind of stuff.

## Get a Database

You can get a free PostgreSQL database on [ElephantSQL](https://www.elephantsql.com/) by following [this tutorial](https://marcopeg.com/setup-a-free-postgresql-database/). Once you set it up, you need to get the full connection string that looks a lot like:

```bash
postgres://ghstdny:jGTHd9Xf9KsGlfgg9fifSCjkdl4fw1G-g@tai.db.elephantsql.com/ghstdny
```

👉 Then you should add it in the Sandbox's **Environmental Variables** as `PGSTRING`.

## Barebone Codebase

If we had to "just get it done", without ForrestJS, and without thinking in terms of modular composition, we could just open up [pg's documentation](https://node-postgres.com/) and write the following code:

```js
// Create a connection pool:
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.PGSTRING });

// Run a query:
const result = await pool.query(`SELECT NOW() AS "current_time"`);
console.log(result.rows[0]);
```

👉 In the beginning, you can simply replace `process.env.PGSTRING` with the hard coded ElephantSQL connection string. Then try to refactor your code so to learn how to use environmental variables.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/050-postgres-connect-osqg3?file=/src/index.js:231-483

---

But that is not our goal, isn't it? We're here to **package this simple logic into a reusable service** that makes it easy for one or more Features to deal with a PostgreSQL database.

> Features should not bother with the infrastructural challenges, they **focus on business logic**!

The service that we are going to build implements 2 main responsibilities:

1. Setup a connection towards the database, offering a degree of service customization and validating a successful connection
2. Offer to new features (and existing services) a simple API to run queries.

## Scaffold your Service

A Service has the very same internal structure of a Feature. Basically, it just uses a different set of Lifecycle hooks, and gets registered before any Feature.

> Moreover, a Service will _likely_ perform some slightly more complex logic compared to a Feature. For this reason, I usually scaffold my services using the Functional Manifest definition.

Create the `/pg/index.js` Service manifest:

```js
// Functional Manifest Definition
// (yes, it's just another JS function)
const pg = ({ registerAction }) => {};

module.exports = pg;
```

> And don't forget to register it in your App's manifest into the `services` list!

## Settings Propagation

Services often need some form of configuration.

In our case, the `pg` service will need to know the _PostgreSQL Connection String_ and the maximum amount of concurent clients that we want to keep alive and connected to our db. Stuff like that are usually done by reading an environmental variable. But accessing environmental variables froum inside our services or features may lead to some nasty bugs when you misspell stuff.

> I strongly recommend you **checkout all your environmental variables** in your App's manifest, and propagate them using the App's `settings` and the `getConfig()` API. Also, you should consider validating your environment using stuff like [envalid](https://www.npmjs.com/package/envalid):

```js
const envalid = require('envalid');

const env = envalid.cleanEnv(process.env, {
  PGSTRING: envalid.url(),
  PG_MAX: envalid.num({ default: 1 }),
});

forrestjs.run({
  settings: {
    pg: {
      connectionString: env.PGSTRING,
      maxConnections: env.PGMAX,
    },
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/050-postgres-service-pw36m?file=/src/index.js:1253-1340

---

With the correct environment, and the settings correctly set up, we can finally use the `getConfig()` API to setup our connection pool.

## Service Initialization

First thing, we hook into the `$INIT_SERVICE` where we create the pool and share it with the rest of the app via _Context API_:

```js
registerAction({
  hook: '$INIT_SERVICE',
  handler: ({ getConfig, setContext }) => {
    // 1. Get the configuration
    const connectionString = getConfig('pg.connectionString');
    const max = getConfig('pg.maxConnections');

    // 2. Create the pool
    const pool = new Pool({
      connectionString,
      max,
    });

    // 3. Share it
    setContext('pg.pool', pool);
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/050-postgres-service-pw36m?file=/src/pg/index.js:179-642

---

## Service Start

When it comes to PG, creating the pool does NOT check out that your connection flows correctly. It just creates the objects and internal wiring for you, but the first query will actually guarantee the correct behavior.

But we don't want other Features to find out the hard way about an incorrect setup. We want to make sure they receive a fully working pool to use in their business logic.

We can simply achieve this goal by hooking into `$SERVICE_START` and checking out the PostgreSQL local time:

```js
registerAction({
  hook: '$START_SERVICE',
  handler: async ({ getContext }) => {
    const pool = getContext('pg.pool');

    try {
      const res = await pool.query(`SELECT now() AS "pgtime"`);
      console.log(`Successfully connected to Postgres`);
      console.log(`pgtime: ${res.rows[0].pgtime}`);
    } catch (err) {
      throw new Error(`Could not connect to PostgreSQL`);
    }
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/050-postgres-service-pw36m?file=/src/pg/index.js:646-1200

---

> Here we use `console.log` for simplicity, but I suggest you also check out the [Service Logger](https://github.com/forrestjs/forrestjs/tree/master/packages/service-logger) that provides a better way to stream your logs to the console or to whatever logging gateway you may choose.

## Features Integration

One of the most important behaviors of a Service is **how does it facilitates Features**.  
Basically:

> what API does your Service provide?

Witht the code we wrote so far, any feature could run a query **after service initialization** using the Context API:

```js
registerAction({
  hook: '$START_FEATURE',
  handler: async ({ getContext }) => {
    const pool = getContext('pg.pool');
    await pool.query('SELECT ...');
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/050-postgres-service-pw36m?file=/src/index.js:454-777

---
