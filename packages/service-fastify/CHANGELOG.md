# Change Log

## ## v4.0.0

- Refactored to remove babel and the build step
- Added support for a `/test` route that can be extended
- Added globals utilities for E2E testing in Jest
- Integrates with `service-env` to provide direct access to `getEnv` in the route handlers

## v1.13.1

Allows register routes with return values from hooks:

```js
features: [
  ['$FASTIFY_ROUTE', { method: 'GET', url: '/', handler: async () => 'hoho' }],
  ['$FASTIFY_GET', ['/', async () => 'hoho']],
  ['$FASTIFY_GET', { url: '/', handler: async () => 'hoho' }],
];
```
