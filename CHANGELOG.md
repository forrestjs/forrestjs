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
  - Deprecate "createHook" in favor of "runHook"
- service-env
  - Remove Babel
  - Update to `setContext` API
- service-jwt
  - Remove Babel
  - Injects the `jwt` API into Fetchq's registered workers
- service-hash
  - Remove Babel
- service-fetchq
  - Upgrade to `@fetchq/node-client` v4.1.0
  - Remove Babel
  - Integrate with `service-fastify`
    - Integrate with the test healthcheck
    - Provide `/test/fetchq/query` get/post utility
    - Provide `/test/fetchq/:queue/:subject` to retrieve a document status
    - Provide `/test/fetchq/await/:queue/:subject` to await a document status with a configurable timeout
  - Provides Jest global utility functions
  - Integrate with `service-fastify-healthz`
  - Add `FETCHQ_DECORATE_CONTEXT` waterfall hook to decorate workers' context
- service-apollo
  - Remove Babel
  - Integrate with `service-fastify`
- service-logger
  - Remove Babel
  - Remove custom methods
  - Rename context's instance api to `log`
  - Improve fastify integration
  - Injects the `log` API into Fetchq's registered workers
- service-fastify
  - Fixes `$REGISTER_ROUTE` hook so to be synchronous and report injections in the boot report
  - Remove babel and the build step
  - Add extendable `/test` route for E2E test support
  - Added globals utilities for E2E testing in Jest
  - Integrates with `service-env` to provide direct access to `getEnv` in the route handlers
  - Add `FASTIFY_OPTIONS` hook that lets hijack into the `fastify.instance.options` object at run time
  - `decoreateReuest` and `decorateReply` add the relative hooks
    automatically
  - Add Moxios for stubbing HTTP requests made with Axios from the
    test environment
- service-fastify-static
  - Remove Babel
- service-fastify-cors
  - Remove Babel
- service-fastify-cookie
  - Remove Babel
- service-fastify-gql
  - Remove Babel
  - Update to 3.0.0-lambda.0
- service-fastify-healthz
  - Remove Babel
  - Add support for healtz preHandler checks
- kitchensink
  - Added examples for `@forrestjs/hooks`
  - Added examples for `@forrestjs/service-fastify`
  - Added examples for `@forrestjs/service-fastify-static`
  - Added examples for `@forrestjs/service-fastify-cors`
  - Added examples for `@forrestjs/service-fastify-cookie`
  - Added examples for `@forrestjs/service-fastify-gql`
  - Added examples for `@forrestjs/service-fastify-healthz`
  - Added examples for `@forrestjs/service-jwt`
  - Added examples for `@forrestjs/service-hash`
  - Added examples for `@forrestjs/service-fetchq`
  - Added examples for `@forrestjs/service-apollo`
  - Added examples for `@forrestjs/service-logger`
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
