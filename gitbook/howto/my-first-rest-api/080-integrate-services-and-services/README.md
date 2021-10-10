<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Integrate Services And Services</h1>

[My First Feature](../README.md) &raquo; [Integrate Services And Services](./README.md)

---

# Integrate Services And Services

Our `pg` Service is in a good shape: it connects to PostgreSQL and it provides a mead for other Features to integrate into it.

> Now it is time to consider how could this Service integrate with other Services and extend their functionalities.

For example, we use [`service-fastify`](https://github.com/forrestjs/forrestjs/tree/master/packages/service-fastify#forrestjsservice-fastify) to erogate a RESTful interface. Wouldn't be nice if a _route handler_ could access the `query()` utility and actively pull data from the db?

Something like:

```js
registerAction({
  hook: '$FASTIFY_GET',
  handler: {
    url: '/',
    handler: async (request, reply) => {
      const data = request.pg.query('SELECT * FROM "public"."users"');
      reply.send(data.rows);
    },
  },
});
```

Well, this is possible when different Services offer enough hooks so to **allow for Service composition**. `service-fastify` is one of those services.

## Decorate Fastify's App

In order to achieve our goal, we would need to decorate Fastify's instance with the `query()` utility from our Service.

That is easily done in our Service's manifest `/pg/index.js`:

```js
registerAction({
  hook: '$FASTIFY_PLUGIN',
  handler: ({ decorateRequest }, { getContext }) => {
    const query = getContext('pg.query');
    decorateRequest('pg', { query });
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/080-integrate-services-and-services-6zc8x?file=/src/pg/index.js:1666-1863

---

This **Integration Action** uses API methods to fetch a reference from the App's context and pipe it into the Fastify's request object.

> **INTEGRATIONS SIMPLY CONNECT THE DOTS**

## Service Order Matter

One cool thing about the [`getContext()` API](../../api/get-context/README.md) is that **it throws an error in case the desired path does not exits**.

This is important beause it let us write data paths as strings, but it will validate their correctness, **majestically reducing runtime errors by typos**.

In our small _integration action_ we want to access `pg.query` from the context, but that context gets created during `$INIT_SERVICE`. Interestingly enough, `$FASTIFY_PLUGIN` is also executed _during_ `$INIT_SERVICE`.

> This is a classic **racing condition** where it is important that `pg` gets initialized **before `service-fastify`**.

One simple solution would be to list `pg` as first service in our App's manifest:

```js
runHookApp({
  services: [pg, serviceFastify],
});
```

But we don't really like the idea to rely on our developers to remember that. It's not really elegant!

## Actions Priority

A much better solution is to use the `priority` option when we register the `pg`'s `$INIT_SERVICE` action, so **to make sure it happens before** Fastify's initialization.

In our Service Manifest `/pg/index.js`:

```js
registerAction({
  hook: '$INIT_SERVICE',
  handler: () => {},

  // Make sure this initialization happens before Fastify's
  priority: 1,
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/080-integrate-services-and-services-6zc8x?file=/src/pg/index.js:826-899

---

Simple, right?

> Every Service or Feature has a **default priority** of `0`.  
> By setting a custom priority we an easily ensure the correct execution order for our actions.

👉 This is something that **should be user very carefully** and only in extreme conditions when you really know what you are doing.

🔥 Setting execution priorities introduces interlaced knowledge between Services or Features, effectively **breaking the decoupled modules** assumption.

**WITH GREAT POWER COMES GREAT RESPONSIBILITY**

## Pull Users From the DB

Now that we have our `pg` service happily integrating with `Fastify`, we can modify the _Users Feature_ so to use the db instead of the in-memory data store.

First we can modify the _list users handler_ so to pull data from the db in `/users/routes/list-users.js`:

```js
const GET_USERS = `SELECT * FROM "public"."users"`;

module.exports = async (request, reply) => {
  const data = await request.pg.query(GET_USERS);
  return data.rows;
};
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/080-integrate-services-and-services-6zc8x?file=/src/users/routes/list-users.js

---

## Insert Users into the DB

Our app has also a second route that manages adding users, also here we can easily reference the `query()` method to push data into our persistent state manager (cool name for "db").

Open `/users/routes/add-users.js`:

```js
const ADD_USER = `
  INSERT INTO "public"."users"
  VALUES ( $1 )
  RETURNING *
`;

const handler = async (request, reply) => {
  try {
    const data = await request.pg.query(ADD_USER, [request.query.name]);
    reply.send(data.rows);
  } catch (err) {
    reply.status(409).send(err.message);
  }
};
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/080-integrate-services-and-services-6zc8x?file=/src/users/routes/add-users.js:0-301

---

## Cleanup the In-Memory State

The last step in moving towards PostgreSQL as state manager would be to cleanup the previously created in-memory store.

We can achieve this by simply removing the `$INIT_FEATURE` action from our Users Feature's manifest in `/users/index.js`.
