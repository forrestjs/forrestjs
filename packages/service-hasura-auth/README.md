# Fastify Hasura Auth

Adds [Hasura Auth](https://hasura.io/docs/latest/graphql/core/auth/authentication/webhook) webhook compatible APIs.

With default settings you should configure your Hasura instance as:

```bash
HASURA_GRAPHQL_AUTH_HOOK=http://your-service.com/hasura-auth
HASURA_GRAPHQL_AUTH_HOOK_MODE=POST
```

## Change the Default Prefix

```js
const serviceFastify = require("@forrestjs/service-fastify");
const serviceHasuraAuth = require("@forrestjs/service-hasura-auth");

forrestjs.run({
  settings: {
    hasuraAuth: {
      // this is the default value
      prefix: "/hasura-auth"
    }
  },
  services: [serviceFastify, serviceHasuraAuth]
});
```

## Setup a GET handler

The following example let you add a validation method to an
Hasura GET Webhook:

```js
const serviceFastify = require("@forrestjs/service-fastify");
const serviceHasuraAuth = require("@forrestjs/service-hasura-auth");

forrestjs.run({
  services: [serviceFastify, serviceHasuraAuth],
  features: [
    {
      target: "$HASURA_AUTH_GET",
      handler: {
        validate: async (request, reply) => {
          const userId = request.headers["x-user-id"];

          if (!userId) {
            throw new Error("User ID not found");
          }

          request.hasuraClaims.push("role", "user");
          request.hasuraClaims.push("user-id", userId);
        }
      }
    }
  ]
});
```

## Setup a POST handler

The following example let you add a validation method to an
Hasura POST Webhook:

```js
const serviceFastify = require("@forrestjs/service-fastify");
const serviceHasuraAuth = require("@forrestjs/service-hasura-auth");

forrestjs.run({
  services: [serviceFastify, serviceHasuraAuth],
  features: [
    {
      target: "$HASURA_AUTH_POST",
      handler: {
        validate: async (request, reply) => {
          const userId = request.body.headers["x-user-id"];

          if (!userId) {
            throw new Error("User ID not found");
          }

          request.hasuraClaims.push("role", "user");
          request.hasuraClaims.push("user-id", userId);
        }
      }
    }
  ]
});
```

Please refer to [Hasura POST Webhook](https://hasura.io/docs/latest/graphql/core/auth/authentication/webhook/#post-request) documentation to figure out what's inside the `request` object.

## The `validate()` Function

Use the `validate()` function to decorate your request with Hasura's claims:

```js
request.hasuraClaims.push("role", "user");
```

or block the request by throwing a simple Javascript error:

```js
throw new Error("Thy shall not pass!");
```

- any claim you add will be serialized and automatically prefixed with `x-hasura-{yourClaim}` for your convenience
- any Error will produce a `401` response status code accordingly to Hasura's specs

## Configure your Route

When extending `$HASURA_AUTH_GET` or `$HASURA_AUTH_POST` you can pass all the [Fastify's Route](https://www.fastify.io/docs/latest/Reference/Routes/) params that will be simply proxied to Fastify:

```js
const myExtension = {
  target: "$HASURA_AUTH_POST",
  handler: {
    // Hasura Auth API:
    validate: (request, reply) => {},

    // Fastify API:
    preHandler: (request, reply) => {},
    schema: {}
  }
};
```

> NOTE: You can not change `method` and `handler`, and `url` is defaulted to `/` but you can override it.
