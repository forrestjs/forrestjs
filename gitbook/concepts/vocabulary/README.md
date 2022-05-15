# Vocabulary - ForrestJS

In ForrestJS we use a few specific terms to refer to different responsibilities or differnent coding activities.

> It takes just a few minutes to go through our vocabulary.  
> Do it!

- [Action](#action)
- [Extension](#extension)
- [Feature](#feature)
- [Service](#service)
- [App](#app)
- [App Manifest](#app-manifest)
- [Service or Feature Manifest](#service-or-feature-manifest)

---

## Action

Actions are at the very core of any ForrestJS Application.

You can **register an Action**, to provide _custom business logic_ to existing Extensions, normally provided by ForrestJS Services that you can install from NPM.

> EXAMPLE: You can _register a new Action_ to the `$FASTIFY_ROUTE` extension
> to provide a new Fastify route definition in your App.

It looks like this:

```js
registerAction({
  target: '$FASTIFY_ROUTE',
  handler: () => {
    /* custom logic */
  },
});
```

The `target` param is a **strong reference** to an Extension name.  
The `handler` provides your business logic.

👉 As many Extensions accepts **declarative handlers**, you will likely see a lot of Actions implemented in a declarative fashion:

```js
registerAction({
  target: '$FASTIFY_ROUTE',
  handler: {
    method: 'GET',
    url: '/',
    handler: async () => 'Hello World',
  },
});
```

---

## Extension

When you create a new _ForrestJS Service_, you can **create new Extensions** as so to allow further specialization of your service logic.

> EXAMPLE: When your Postgres connection is established, you _create
> a new extension_ so that other Features can run their initialization
> SQL queries.

---

## Feature

A **ForrestJS Feature** is a package of Extensions that serve the same goal.

> EXAMPLE: you can pack together a few `$FASTIFY_ROUTE` extensions into a Feature called "static-pages".

Such Feature has the goal to provide generic information to the website visitor.

---

## Service

A **ForrestJS Service** implements a generic piece of business logic that should extended by some Features in order to provide real user value.

> EXAMPLE: [`service-pg`](https://github.com/forrestjs/forrestjs/tree/master/packages/service-pg) keeps an active connection pool towards a PostgreSQL database.
>
> But without some Features that actually use it to run some SQL
> queries, it doesn't really do much for the end user.

Services are often thin wrappers around existing NPM Modules such [Fastify](https://www.fastify.io/) or [Node Postgres](https://node-postgres.com/).

---

## App

A **ForrestJS App** is a composition of Services and Features that provide some kind of User value.

## App Manifest

We call "App Manifest" the entry point of a ForrestJS App (usually `src/index.js`).

This piece of code is mostly declarative and implements some specific responsibilities:

1. Validate the App's Environment
2. Provide configuration to Services and Features
3. Compose the App with lists of Services and Features
4. Handle boot errors

---

## Service (or Feature) Manifest

We call "Service or Feature Manifest" the entry point of a ForrestJS Service or Feature. (usually: `src/(services|features)/xxx/index.js`).

This piece of code is mostly declarative and implements some specific responsibilities:

1. Register all the Extensions that are implemented by the Service/Feature
2. Declare new Extension's Targets for **new Extensions** provided by the Service/Feature
