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
