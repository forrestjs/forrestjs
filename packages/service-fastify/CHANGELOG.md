# Change Log


## v5.0.0 (Roadmap)

- [ ] Remove `reply` object decorations

## v4.6.0

- Require `DANGEROUSLY_ENABLE_FASTIFY_TDD_ENDPOINT=yes` env variable to explicitly enable the TDD route support

## v4.5.0

- Deprecate `$FASTIFY_GET`
- Deprecate `$FASTIFY_POST`
- Deprecate `$FASTIFY_PUT`
- Deprecate `$FASTIFY_DELETE`

## v4.4.1

- Update libraries
- Add `setConfig` to the server and request instances
- Add `setContext` to the server and request instances

## v4.0.0

- Refactored to remove babel and the build step
- Added support for a `/test` route that can be extended
- Added globals utilities for E2E testing in Jest
- Integrates with `service-env` to provide direct access to `getEnv` in the route handlers
- Add `FASTIFY_OPTIONS` hook that lets hijack into the `fastify.instance.options` object at run time
- `decoreateReuest` and `decorateReply` add the relative hooks
  automatically
- Add Moxios for stubbing HTTP requests made with Axios from the
  test environment

## v1.13.1

Allows register routes with return values from hooks:

```js
features: [
  ['$FASTIFY_ROUTE', { method: 'GET', url: '/', handler: async () => 'hoho' }],
  ['$FASTIFY_GET', ['/', async () => 'hoho']],
  ['$FASTIFY_GET', { url: '/', handler: async () => 'hoho' }],
];
```
