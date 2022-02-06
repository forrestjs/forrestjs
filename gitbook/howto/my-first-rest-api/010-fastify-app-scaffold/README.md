<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Fastify App's Scaffold</h1>

[My First REST API](../README.md) &raquo; [Fastify App's Scaffold](./README.md)

---

# Fastify App's Scaffold

Create a new `app.js` file and use the following scaffold to kick off a new ForrestJS App:

```js
// Import dependencies, mostly services that wrap famous Open Source libraries:
const forrestjs = require('@forrestjs/hooks');
const fastify = require('@forrestjs/service-fastify');
const fastifyHealthz = require('@forrestjs/service-fastify-healthz');

forrestjs
  .run({
    // It shows boot trace in the console
    // (very useful while developing)
    trace: 'compact',

    // You can set any kind of settings for your app
    // Services and Features will be able to read from this object via APIs
    settings: {},

    // Services provide infrastructure to your business value
    services: [fastify, fastifyHealthz],

    // Features implement your business value
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
  (this should yield a 404 as there is no route configured yet)
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
