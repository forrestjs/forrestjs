<h1 class="tutorial-step"><span>My First REST API &raquo;</span> The Users Feature</h1>

[My First Feature](../README.md) &raquo; [The Users Feature](./README.md)

---

# The Users Feature

Now it's time to build a dynamic feature that is capable of storing some state, and offer an API to read it and modify it.

We are going to build a CRUD API over a list of users. To keep things simple, we will keep the state in the process' memory (in the simple form of an _Array_) and each user will be a simple string. 

> The goal is to study how we can leverage in ForrestJS' **context API** to handle a dynamic memory allocation that is safely scoped to the running App.

## Create a context for the Users Feature

The first goal to achive is to allocate a piece of memory where to store our list of users. Here are some requirements for this goal:

- this memory should be scoped to the App's and not leaking to the rest of the process
- this memory should be accessible to the REST endpoints that we will implement later on
- we should use reliable API, and do not play with weird Javascript black magic tricks

With that in mind, let's create the feature's manifest and register the first action in `/users/index.js`:

```js
const usersFeature = ({ registerAction }) => {
  registerAction({
    hook: "$INIT_FEATURES",
    handler: ({ setContext }) => {
      setContext("users.list", [
        'Luke Skywalker', 
        'Ian Solo'
      ]);
    }
  });
};

module.exports = usersFeature;
```

> The `$INIT_FEATURES` hook is part of a ForrestJS App lifecycle.   
> It allows to inject custom logic during the booting of our App. 

In our specific case, we use it to inizialize the _Users Database_ with some dummy data from Star Wars.

The [`setContext()`](../../../api/set-context/README.md) utility facilitates the definition of an App scoped piece of memory. Later on, we will be able to read from this memory using the `getContext()` function.

## List Users Route

Now that we have the "database" in place, it is time to create a route handler that is able to expose this data to the public.

Let's create `./routes/list-users.js`:

```js
module.exports = (request, reply) => {
  const users = request.getContext("users.list");
  reply.send(users);
};
```

As we saw in the [Home Page's tutorial](../020-fastify-home-page/README.md) it is possible to define a Fastify's route handler as a standalone Javascript module.
And ForrestJS decorates Fastify's `request` object with its own API, making it easy to deal with the rest of the application.

The logic here is trivial:

1. get the users list from the App's context
2. send it out as JSON (which is the default behavior in Fastify)

The last bit is to integrate this route handler with Fastify Service in the Feature's manifest:

```js
const listUsersRoute = require("./routes/list-users");

const usersFeature = ({ registerAction }) => {
  // $INIT_FEATURES

  registerAction({
    hook: "$FASTIFY_ROUTE",
    handler: [
      {
        method: "GET",
        url: "/users",
        handler: listUsersRoute
      }
    ]
  });
};

module.exports = usersFeature;
```

Please note that here we are using a different Fastify _hook_ in this example: `$FASTFY_ROUTE`.  
This hooks let us setup a complete route definition as in [`fastify.route()`](https://www.fastify.io/docs/latest/Routes/#full-declaration), 
which is actually called [under the hood](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify/src/start-service-handler.js#L92).

---

**💻 Live on CodeSandbox:**   
https://codesandbox.io/s/030-the-users-feature-gqqp3

---