<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Fastify App's Scaffold</h1>

[My First REST API](../README.md) &raquo; [Fastify App's Scaffold](./README.md)

---

# Fastify App's Scaffold

Create a new `app.js` file and use the following scaffold to kick off a new ForrestJS App:

```js
const { runHookApp } = require('@forrestjs/hooks');
const fastify = require('@forrestjs/service-fastify');
const fastifyHealthz = require('@forrestjs/service-fastify-healthz');

forrestjs
  .run({
    trace: 'compact',
    settings: {},
    services: [fastify, fastifyHealthz],
    features: [],
  })
  .catch(console.error);
```

Once ready, you can run it with:

```sh
npx nodemon app
```

Once the app is running, you should test it at the following urls:

- http://localhost:8080  
  (this should yield a 404 as there is no configure route, yet.)
- http://localhost:8080/healthz  
  (this should yield an health check status message, as provided by the `fastifyHealthz` service)

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/fastify-app-scaffold-oc3q9?file=/src/index.js

> **NOTE:** CodeSandbox requires the following settings in order to setup the proper ports binding.

```js
settings: {
  fastify: {
    meta: null;
  }
}
```

---
