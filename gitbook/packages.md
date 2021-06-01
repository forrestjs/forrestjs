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

It creates a Fastify instance into the ForrestJS app, and let other features extend it with routes and plugins.

### service-fastify-healthz

It integrates with Fastify to expose a `/healthz` healthcheck endpoint. Features can integrate here to run their checks and invalidate it in case something goes wrong.

### service-fastify-static

It integrates with Fastify and easily let you serve static files. (Althoug, I want to remember you that NGiNX or a simple CDN will do better)

### service-fastify-cookie

It integrates with Fastify and exposes an interface to read and write cookies, safely.

### service-fastify-gql

It integrates Apollo Server with Fastify and exposes an interface to easily define your GraphQL types, queries and mutations.

### service-apollo

It integrates Apollo Client and exposes a simple interface to consume a GraphQL endpoint.

### service-fetchq

It connects with Postgres and manages a Fetchq client for you. It exposes a simple hook based API to create queues and associate workers.

### service-jwt

Helps to issue and validate _JWT_ tokens. It is mainly a _Promise_ wrapper around the
package `jsonwebtoken`.

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-jwt)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-jwt/README.md#readme)

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
