# @forrestjs/service-fastify-static

ForrestJS wrapper to the [Fastify Static](https://github.com/fastify/fastify-static) plugin.

## Live Demo

https://codesandbox.io/s/service-fastify-static-6u8mm

## Install & Setup

Install the dependency:

```bash
npm add @forrestjs/service-fastify-static
```

Add it to your App:

```js
// index.js
const path = require('path');
const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyStatic = require('@forrestjs/service-fastify-static');

// Run the app:
forrestjs.run({
  services: [serviceFastify, serviceFastifyStatic],
  settings: {
    fastify: {
      static: {
        root: path.join(__dirname, 'public'),
      },
    },
  },
});
```

## Options

```js
setConfig('fastify.static', {
  ...options here
});
```
