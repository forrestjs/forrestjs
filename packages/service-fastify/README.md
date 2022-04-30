# @forrestjs/service-fastify

ForrestJS service which helps setting up an FastifyJS server.

DEMO:  
https://codesandbox.io/s/service-fastify-th8dq

## Install & Setup

```bash
npm add @forrestjs/service-fastify
```

Set it up in your FastifyJS App:

```js
// index.js
const forrestjs = require('@forrestjs/core');
const fastifyService = require('@forrestjs/service-fastify');

// Create an Home Page for the Web App
const homePage = () => ({
  target: '$FASTIFY_ROUTE',
  handler: [
    {
      method: 'GET',
      url: '/',
      handler: async () => `Hello World`,
    },
  ],
});

// Run the App:
forrestjs.run({
  settings: {
    fastify: {
      port: 8080,
    },
  },
  services: [fastifyService],
  features: [homePage],
});
```

---

## Configuration & Environment

### 📝 fastify.port

Sets up the port on which the server will listen for requests.

It falls back to environment variables:

- `process.env.REACT_APP_PORT`
- `process.env.PORT`
- `8080` (default value)

### 📝 fastify.instance.options

Let you pass arbitrary configuration to the [Fastify instance](https://www.fastify.io/docs/latest/Guides/Getting-Started/#your-first-server).

### 📝 fastify.tdd.scope

Let you setup the root of the testing APIs.

Default: `/test`

---

## Context

The ForrestJS App will be decorated with:

### 🌎 fastify

A reference to the Fastify instance as configured during the booting of the App. It allows to fully manipulate the running server.

```js
const fastify = getContext('fastify');
```

### 🌎 axios

A reference to the static instance of Axios.

```js
const axios = getContext('axios');
await axios.get('/');
```

---

## Testing Support

Service Fastify ships testing facilities with the goal of making end-2-end testing easy for you.

The idea is to let the testing enviornment interact with the Fastify instance using REST APIs that are available exclusively whith
`process.env.NODE_ENV` set to:

- development
- test

Those test-specific APIs are exposed under a `/test/...` root that you can change by setting `fastify.tdd.root`.

### Test Healthcheck

The root Route `/test` acts as healthcheck for running tests. Any test client should await for a `200` reply from this endpoint before attempting to run any call.

By default there is no logic to this healthcheck, but you can interact with by implementing two extensions:

- `$FASTIFY_TDD_CHECK`
- `$FASTIFY_TDD_ROOT`

### Test APIs

`get://test/reset`

Runs the `$FASTIFY_TDD_RESET` handlers to reset the App's state.

`get://test/config`

`post://test/config`

`post://test/axios/stubs`

`delete://test/axios/stubs`

---

## Extensions

> All the extensions exposed by `service-fastify` are _synchronous_ and executes in _serie_.

### 🧩 FASTIFY_OPTIONS

It allows to programmatically modify the options that are given to the Fastify's instance, it works in **waterfall**.

```js
registerAction({
  target: '$FASTIFY_OPTIONS',
  handler: (defaultOptions) => ({
    ...defaultOptions,
    logger: true,
  }),
});
```

### 🧩 FASTIFY_HACKS_BEFORE

This hook fires before any other step.  
It receives a direct reference to the `fastify` instance.

```js
registerAction({
  target: '$FASTIFY_HACKS_BEFORE',
  handler: ({ fastify }) => {
    // Do something with the Fastify's instance
    fastify.register();
  },
});
```

### 🧩 FASTIFY_HACKS_AFTER

This hook fires after any other step.  
It receives a direct reference to the `fastify` instance.

```js
registerAction({
  target: '$FASTIFY_HACKS_AFTER',
  handler: ({ fastify }) => {
    // Do something with the Fastify's instance
    fastify.register();
  },
});
```

### 🧩 FASTIFY_PLUGIN

Let register Fastify plugins or decorate the instance.

```js
registerAction({
  hook: '$FASTIFY_PLUGIN',
  handler: ({ registerPlugin }) => {
    registerPlugin(/* fastify plugin */);
    registerPlugin(/* fastify plugin */);
  },
});
```

It also receives API for decorating the Fastify instance:

```js
registerAction({
  hook: '$FASTIFY_PLUGIN',
  handler: ({ decorateRequest }) => {
    const user = { name: 'Marco' };
    decorateRequest('user', user);
  },
});
```

### 🧩 FASTIFY_ROUTE

Lets implement first level routes in your Fastify instance:

```js
// With the API:
registerAction({
  target: '$FASTIFY_ROUTE',
  handler: ({ registerRoute }) =>
    registerRoute({
      method: 'GET',
      url: '/',
      handler: (req, res) => res.send('Hello World'),
    }),
});

// With direct values:
registerAction({
  target: '$FASTIFY_ROUTE',
  handler: () => ({
    method: 'GET',
    url: '/',
    handler: (req, res) => res.send('Hello World'),
  }),
});

// With multiple routes
registerAction({
  target: '$FASTIFY_ROUTE',
  handler: () => [
    {
      method: 'GET',
      url: '/p1',
      handler: (req, res) => res.send('Page1'),
    },
    {
      method: 'GET',
      url: '/p2',
      handler: (req, res) => res.send('Page2'),
    },
  ],
});
```

### 🧩 FASTIFY_TDD_RESET

```js
registerAction({
  target: '$FASTIFY_TDD_CHECK',
  handler: ({ registerTddReset }) => {
    registerTddCheck(async ({ getContext }) => {
      const pg = getContext('pg');
      return pg.query('DROP SCHEMA "public" CASCADE');
    });
  },
});
```

### 🧩 FASTIFY_TDD_CHECK

Let you inject [`preHandlers`](https://www.fastify.io/docs/latest/Reference/Hooks/#prehandler) to the `/test` route.

Use this to await for database connections or other preconditions.

```js
registerAction({
  target: '$FASTIFY_TDD_CHECK',
  handler: ({ registerTddCheck }) => {
    // Middleware style
    registerTddCheck((request, reply, next) => {
      console.log('Healthcheck with callback');
      next();
    });

    // Async style
    registerTddCheck(async (request, reply) => {
      console.log('Asynchronous healthcheck');
    });
  },
});
```

### 🧩 FASTIFY_TDD_ROOT

Let you implement the returning body of the `/test` route.

```js
registerAction({
  target: '$FASTIFY_TDD_ROOT',
  name: 'registerTddRoute',
  handler: () => (request, reply) => reply.send('ok'),
});
```

### 🧩 FASTIFY_TDD_ROOT

Let you extend the `/test` API with custom sub-routes.

It works exactly as `$FASTIFY_ROUTE`, but all the routes you define are scoped with the testing prefix.
