# @forrestjs/core

ForrestJS helps you build a **Modular JavaScript Application** where you can (almost) forget about the infrastructure and **FOCUS ON YOUR BUSINESS VALUE**.

---

## Install & Setup

```js
npm add @forrestjs/core
```

---

## Quick Code Example

```js
const forrest = require('@forrestjs/core');
const fastify = require('@forrestjs/service-fastify');

forrest.run({
  // Add ForrestJS wrappers to famous and useful libraries
  services: [fastify],

  // Integrate your Business Logic with the running services
  features: [{
    target: '$FASTIFY_ROUTE',
    handler: {
      method: 'GET',
      url: '/',
      handler: async () => 'Hello World',
    },
  }],

  // Provide configuration to Services and Features
  settings: {
    fastify: {
      port: '8080'
    }
  }
]);
```

---

## Documentation

- Concepts
  - [Vocabulary](./docs/vocabulary/README.md)
  - [App Lifecycle Extensions](./docs/lifecycle/README.md)
