## 4.0.0

- Add VSCode and Prettier config
- Start Kitchensink demo package
  - Add examples and tests for `service-fastify`
- Bumped dependencies
  - @babel/core
  - @babel/runtime
  - @babel/cli
  - concurrently
  - jest
  - lerna
  - fastify-cookie
  - fastify-cors
  - fastify-static
  - apollo-server-fastify (still doesn't work at all)
- hooks
  - Removed babel
  - Features and services names defaults are derived by their registration form and automatically prefixed
  - Added support for positional definition in `registerRoute`
  - Allows for order-independent service2service and feature2feature integration
- service-env
  - Remove Babel
  - Update to `setContext` API
- service-jwt
  - Remove Babel
- service-hash
  - Remove Babel
- service-fetchq
  - Remove Babel
  - Integrate with `service-fastify`
- service-apollo
  - Remove Babel
  - Integrate with `service-fastify`
- service-fastify
  - Fixes `$REGISTER_ROUTE` hook so to be synchronous and report injections in the boot report
  - Remove babel and the build step
  - Add extendable `/test` route for E2E test support
  - Added globals utilities for E2E testing in Jest
  - Integrates with `service-env` to provide direct access to `getEnv` in the route handlers
- service-fastify-static
  - Remove Babel
- service-fastify-cors
  - Remove Babel
- service-fastify-cookie
  - Remove Babel
- service-fastify-gql
  - Remove Babel
  - Update to 3.0.0-lambda.0
- kitchensink
  - Added examples for `@forrestjs/hooks`
  - Added examples for `@forrestjs/service-fastify`
  - Added examples for `@forrestjs/service-fastify-static`
  - Added examples for `@forrestjs/service-fastify-cors`
  - Added examples for `@forrestjs/service-fetchq-cookie`
  - Added examples for `@forrestjs/service-fetchq-gql`
  - Added examples for `@forrestjs/service-jwt`
  - Added examples for `@forrestjs/service-hash`
  - Added examples for `@forrestjs/service-fetchq`
  - Added examples for `@forrestjs/service-apollo`
  - Added `app01` examples for a complex app

## 3.20.2

- Bumped dependencies
  - fastify
  - fastify-jwt
  - fastify-cookie
  - fastify-static
  - fastify-cors
  - apollo-server-fastify
  - @apollo/federation
  - @fetchq/pg-pubsub
  - graphql

## 3.20.0

- Bump dev libraries
- Bump Fetchq library
