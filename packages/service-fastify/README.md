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

`fastify.port: 5000` sets up the port on which the server runs.

It falls back to environment variables:

- process.env.REACT_APP_PORT
- process.env.PORT
- 8080 (default value)

## Hooks

All the hooks exposed by `service-fastify` are _synchronous_ and executes in _serie_.

### FASTIFY_HACKS_BEFORE

This hook fires before any other step.<br>
It receives a direct reference to the `fastify` instance.

### FASTIFY_PLUGIN

Let register Fastify plugins or decorate the instance.

```js
const { FASTIFY_PLUGIN } = require('@forrestjs/service-fastify');

registerAction({
  hook: FASTIFY_PLUGIN,
  handler: ({ registerPlugin }) => registerPlugin(/* fastify plugin */),
});
```

### FASTIFY_ROUTE

```js
const { FASTIFY_ROUTE } = require('@forrestjs/service-fastify');

registerAction({
  hook: FASTIFY_ROUTE,
  handler: ({ registerRoute }) =>
    registerRoute({
      method: 'GET',
      url: '/',
      handler: (req, res) => res.send('Hello World'),
    }),
});

// or with direct values

registerAction({
  hook: FASTIFY_ROUTE,
  handler: () => ({
    method: 'GET',
    url: '/',
    handler: (req, res) => res.send('Hello World'),
  }),
});

// even with multiple routes

registerAction({
  hook: FASTIFY_ROUTE,
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
