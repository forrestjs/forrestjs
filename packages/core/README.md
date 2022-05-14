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

## Vocabulary

### ForrestJS Extensions

Extensions are at the very core of any ForrestJS Application. You can create or implement (register) extensions, depending on what you want to achieve.

When you create a ForrestJS Feature, you **register extensions** in order to provide _custom business logic_ to existing Services (and Features).

> EXAMPLE: You can _register a new extension_ to `$FASTIFY_ROUTE`
> to provide a new Fastify route definition in your app.

When you create a new _ForrestJS Service_, you **create new extensions** as so to allow further specialization of your logic.

> EXAMPLE: When your Postgres connection is established, you _create
> a new extension_ so that other Features can run their initialization
> SQL queries.

### ForrestJS Feature

A **ForrestJS Feature** is a package of Extensions that serve the same goal.

> EXAMPLE: you can pack together a few `$FASTIFY_ROUTE` extensions into a Feature called "static-pages".

Such Feature has the goal to provide generic information to the website visitor.

### ForrestJS Service

A **ForrestJS Service** implements a generic piece of business logic that should extended by some Features in order to provide real user value.

> EXAMPLE: [`service-pg`](https://github.com/forrestjs/forrestjs/tree/master/packages/service-pg) keeps an active connection pool towards a PostgreSQL database.
>
> But without some Features that actually use it to run some SQL
> queries, it doesn't really do much for the end user.

Services are often thin wrappers around existing NPM Modules such [Fastify](https://www.fastify.io/) or [Node Postgres](https://node-postgres.com/).

### ForrestJS App

A **ForrestJS App** is a composition of Services and Features that provide some kind of User value.

### App Manifest

We call "App Manifest" the entry point of a ForrestJS App (usually `src/index.js`).

This piece of code is mostly declarative and implements some specific responsibilities:

1. Validate the App's Environment
2. Provide configuration to Services and Features
3. Compose the App with lists of Services and Features
4. Handle boot errors

### Service (or Feature) Manifest

We call "Service or Feature Manifest" the entry point of a ForrestJS Service or Feature. (usually: `src/(services|features)/xxx/index.js`).

This piece of code is mostly declarative and implements some specific responsibilities:

1. Register all the Extensions that are implemented by the Service/Feature
2. Declare new Extension's Targets for **new Extensions** provided by the Service/Feature

---

## App Boot Lifecycle
