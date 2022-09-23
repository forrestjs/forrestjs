## 5.0.0 (roadmap)

- [ ] remove support for declarative array definition `const f1 = [hook, handler]`
- [ ] remove `runHookApp` and `createHookApp`
- [ ] remove `createHook` support
- [ ] remove `registerAction` support
- [ ] remove `registerHook` support
- [ ] remove `FASTIFY_GET` and other methods support
- [ ] action's parameter will be reversed (ctx, action's data)
- [ ] The targets registry should be scoped by an App. It should be possible to run independent ForrestJS apps side by side.

## 4.X.X (roadmap)

- [ ] Add a fullstack test in `service-fetchq` with a task entered by a route and then a polling to monitor completion of such task
- [ ] write `service-pg-pubsub` accepting `PGSTRING`

## 4.7.2

- [core] Improve errors for invalid actions

## 4.7.1

- [service-fetchq-task] Customize queue name via configuration
- [service-fetchq-task] Add queue configuration
- [service-fetchq-task] Add worker configuration
- [service-fetchq-task] Reset on boot
- [kitchensink] Add example for `service-fetchq-task`

## 4.7.0

- Add `service-fetchq-task`

## 4.6.0

- Require `DANGEROUSLY_ENABLE_FASTIFY_TDD_ENDPOINT=yes` env variable to explicitly enable the TDD route support
- Add `service-hasura-client`

## 4.5.0

- [service-fastify-static] Update dependencies
- [service-fastify-cors] Update dependencies
- [service-fastify-cookie] Update dependencies
- [service-fastify-gql] Update dependencies
- [service-fastify-apollo] Update dependencies
- Deprecate `service-env`
- Deprecate `service-postgres`
- Deprecate `service-postgres-pubsub`
- [core] Deprecate `registerAction([name, handler, option])`
- [core] Deprecate `registerAction(name, handler, option)`
- [core] Deprecate `registerAction()` in favor of `registerExtension()`
- [core] Deprecate the `forrest.run([ feature, feature ])`
- [service-fastify] Deprecate `$FASTIFY_GET`
- [service-fastify] Deprecate `$FASTIFY_POST`
- [service-fastify] Deprecate `$FASTIFY_PUT`
- [service-fastify] Deprecate `$FASTIFY_DELETE`
- [core] The appTrace integration goes last in `$FINISH`
- [core] Moved the App tracing log out of the `$FINISH` extension
- [core] Improve `getConfig()` error trace
- [core] Improve `getContext()` error trace
- [core] Improve `registerAction()` error trace
- [core] Improve `createExtension()` error trace

## 4.4.2

- [core] Expose all registered targets

## 4.4.1

- [pg] Add `pg` dependency to the service-pg
- [service-fastify] Add `setConfig` to the server and request instances
- [service-fastify] Add `setContext` to the server and request instances
- [service-fastify] Deprecate `registerResetHandler()` in favor of `registerTddReset()`
- [service-fastify] Improve documentation

## 4.4.0

- deprecate `service-postgres` and write `service-pg` accepting `PGSTRING`
- add `service-pg`
- add `service-pg-schema`
- add `service-jwks`
- add `service-meta`
- add `service-hasura-auth`

## 4.3.0

- [core] `createExtension` accepts referenced Target names as in `$TARGET_NAME`
- [core] deprecate `getAction` for `getTarget`
- [core] allows to register a plain Action or list of Actions
- Fix Apollo Client service

## 4.2.0

- Deprecate `createHook` for `runActions`
- Deprecate `registerAction({ hook: 'xxx' })` for `registerAction({ target: 'xxx', name: 'yyy' })`
- Deprecate `registerAction` for `registerExtension`
- Deprecate `registerHook` for `registerTargets` who always get a map of hooks to add
- Deprecate `getHook()` for `getAction()`
- Fix kitchensink/mock-axios-e2e
- Fix service order dependency in `service-fetchq` - it should work seamlessly before/after `service-fastify`

## 4.1.0

- Deprecate array based declarative features [ hook, handler, ... ]
- Deprecate `runHookApp`
- Deprecate `createHookApp`
- Handle a list of declarative hooks as a Feature manifest
- Expose `forrestjs.run()` API

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
