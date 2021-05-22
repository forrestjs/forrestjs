## 3.21.0

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
  - removed babel
  - Features and services names are extensively derived by their registration form and automatically prefixed
- service-fastify
  - Fixes `$REGISTER_ROUTE` hook so to be synchronous and report injections in the boot report
  - Remove babel and the build step
  - Add extendable `/test` route for E2E test support
  - Added globals utilities for E2E testing in Jest

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
