# @forrestjs/service-fastify-healthz

ForrestJS service which helps setting up an Fastify healthcheck route.

DEMO:  
https://codesandbox.io/s/service-fastify-healthz-4g3my

## Install & Setup

```bash
npm add @forrestjs/core @forrestjs/service-fastify @forrestjs/service-fastify-healthz
```

set it up in your FastifyJS App:

```js
// index.js
const forrestjs = require('@forrestjs/core');
const fastifyService = require('@forrestjs/service-fastify');
const fastifyHealthzService = require('@forrestjs/service-fastify-healthz');

// Run the app:
forrestjs.run({
  services: [fastifyService, fastifyHealthzService],
});
```

## Configuration & ENVs

### fastify.healthz.method

default: `GET`

### fastify.healthz.url

default: `/healthz`

## Extensions

### 🧩 $FASTIFY_HEALTHZ_HANDLER

This hooks allows to override the default healthcheck route.  
It is useful in case you want to perform rich logic during a healthcheck.

```js
// Create a custom healthcheck response
const HEALTHZ_MSG = 'This is a custom healthcheck response';
const customHealthz = ({ registerHandler }) =>
  registerHandler(async () => HEALTHZ_MSG);

forrestjs.run({
  features: [
    {
      target: '$FASTIFY_HEALTHZ_HANDLER',
      handler: customHealthz,
    },
  ],
});
```
