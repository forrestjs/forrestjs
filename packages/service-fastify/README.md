# @forrestjs/service-fastify

ForrestJS service which helps setting up an FastifyJS server.

DEMO:  
https://codesandbox.io/s/service-fastify-th8dq

## Install & Setup

```bash
npm install --save @forrestjs/service-fastify
```

set it up in your FastifyJS App:

```js
// index.js
const { runHookApp } = require('@forrestjs/hooks');
const fastifyService = require('@forrestjs/service-fastify');

// Create an Home Page for the Web App
const homePageFeature = ({ registerAction }) =>
  registerAction({
    hook: '$FASTIFY_ROUTE',
    handler: {
      method: 'GET',
      url: '/',
      handler: async () => 'Hello World',
    },
  });

// Run the app:
runHookApp({
  settings: {
    fastify: {
      port: 8080,
    },
  },
  services: [fastifyService],
  features: [homePageFeature],
});
```

## Configuration & ENVs

### port

`setConfig('fastify.port', 8080)` sets up the port on which the server will listen for requests.

It falls back to environment variables:

- process.env.REACT_APP_PORT
- process.env.PORT
- 8080 (default value)

## Context

The service's App will be decorated with:

### fastify

A reference to the Fastify instance as configured during the booting of the App. It allows to fully manipulate the running server.

```js
getContext('fastify');
```

### axios

A reference to the static instance of Axios.

```js
const axios = getContext('fastify');
await axios.get('/');
```

## Hooks

All the hooks exposed by `service-fastify` are _synchronous_ and executes in _serie_.

### FASTIFY_OPTIONS

It allows to programmatically modify the options that are given to the Fastify's instance, it works in **waterfall**.

[[TODO: CREATE AN EXAMPLE]]  
[[TODO: CREATE AN CODESANDBOX]]

### FASTIFY_HACKS_BEFORE

This hook fires before any other step.<br>
It receives a direct reference to the `fastify` instance.

```js
registerAction({
  hook: '$FASTIFY_HACKS_BEFORE',
  handler: ({ fastify }) => {
    // Do something with the Fastify's instance
    fastify.register();
  },
});
```

### FASTIFY_PLUGIN

Let register Fastify plugins or decorate the instance.

```js
const { FASTIFY_PLUGIN } = require('@forrestjs/service-fastify');

registerAction({
  hook: FASTIFY_PLUGIN,
  handler: ({ registerPlugin }) => registerPlugin(/* fastify plugin */),
});
```

[[TODO: CREATE AN CODESANDBOX]]

### FASTIFY_ROUTE

```js
// with the API:
registerAction({
  hook: '$FASTIFY_ROUTE',
  handler: ({ registerRoute }) =>
    registerRoute({
      method: 'GET',
      url: '/',
      handler: (req, res) => res.send('Hello World'),
    }),
});

// or with direct values:
registerAction({
  hook: '$FASTIFY_ROUTE',
  handler: () => ({
    method: 'GET',
    url: '/',
    handler: (req, res) => res.send('Hello World'),
  }),
});

// even with multiple routes
registerAction({
  hook: '$FASTIFY_ROUTE',
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

### FASTIFY_HACKS_AFTER

This hook fires after any other step.<br>
It receives a direct reference to the `fastify` instance.

```js
registerAction({
  hook: '$FASTIFY_HACKS_AFTER',
  handler: ({ fastify }) => {
    // Do something with the Fastify's instance
    fastify.register();
  },
});
```
