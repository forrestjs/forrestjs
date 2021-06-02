# ForrestJS Packages

Over the years, I found myself configuring some basic stuff over and over again.
Nowadays I do my best to abstract generic needs into sharable and reusable packages
that you find listed here.

Most of them consist in very little amount of code, but they provide _hooks_ so that
your application can **easily extend and customize their behaviour**.

## Hooks

This is the core of ForrestJS modularity. It allows you to implement extensible applications made of composable feature pretty much **like Wordpress does with their plugins**, but in a Node fashion and with
traceable and debuggable support.

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/hooks)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/hooks/README.md#readme)  
👉 [Introduction Example on CodeSandbox](https://codesandbox.io/s/intro-yjxhe?file=/src/index.js)
👉 [Kitchen Sink Example](https://github.com/forrestjs/forrestjs/blob/master/packages/kitchensink/hooks/index.js)

## Services

### service-env

Reads environment configuration from different _dot-files_ into your `process.env` variable, and provides a safe interface to access environmental variables.

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-env)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-env/README.md#readme)

### service-logger

It exposes a simple interface to logging using [Winston](https://www.npmjs.com/package/winston) under the hood.

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-logger)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-logger/README.md#readme)

### service-fastify

It creates a [Fastify](https://www.fastify.io/) instance into the ForrestJS app, and let other features extend it with routes and plugins.

👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify)  
👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify/README.md#readme)  
👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-th8dq)

### service-fastify-healthz

It integrates with Fastify to expose a `/healthz` healthcheck endpoint. Features can integrate here to run their checks and invalidate it in case something goes wrong.

### service-fastify-static

It integrates with Fastify for serving static files. (Although, I want to remember you that NGiNX or a simple CDN will do better)

Wrapper around [fastify-static](https://www.npmjs.com/package/fastify-static) plugin.

👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-static)  
👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-static/README.md#readme)  
👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-static-6u8mm)

### service-fastify-cookie

It integrates with Fastify and exposes an interface to read and write cookies, safely.

Wrapper around [fastify-cookie](https://github.com/fastify/fastify-cookie) plugin.

👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-cookie)  
👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-cookie/README.md#readme)  
👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-cookie-pq2m0)

### service-fastify-gql

Sets up an [Apollo Graphql Server](https://www.apollographql.com/docs/apollo-server/)
in the ForrestJS app and provides hooks to extend the schema from a feature.

👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-gql)  
👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-gql/README.md#readme)  
👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-gql-3ijs6)

### service-apollo

Sets up an Apollo Client in the ForrestJS app and makes it available to route handlers.

👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-apollo)  
👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-apollo/README.md#readme)  
👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-apollo-80oug)

### service-fetchq

Sets up an Fetchq Client in the ForrestJS app and makes it available to route handlers.

👉 [Install it from NPM](https://www.npmjs.com/package/@forrestjs/service-fastify-fetchq)  
👉 [Open the Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify-fetchq/README.md#readme)  
👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-fetchq-0by8x)

### service-jwt

Helps to issue and validate _JWT_ tokens. It is mainly a _Promise_ wrapper around the
package `jsonwebtoken`.

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-jwt)  
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-jwt/README.md#readme)  
👉 [**Open the CodeSandbox example**](https://codesandbox.io/s/service-fastify-jwt-fnfqc)

### service-hash

It provides some basic cryptographic helper methods to safely hash passwords.

[[to be completed]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-hash)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-hash/README.md#readme)

### service-postgres

It helps establishing a reliable connection with one or more _Postgres_ databases using the
library `sequelize`. It also provide hooks for features to provide their own data models in
isolation.

[[to be completed]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-postgres)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-postgres/README.md#readme)
