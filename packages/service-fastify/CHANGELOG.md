# Change Log

## v1.13.1

Allows register routes with return values from hooks:

```js
features: [
  [ '$FASTIFY_ROUTE', { method: 'GET', url: '/', handler: async () => 'hoho' } ],
  [ '$FASTIFY_GET', ['/', async () => 'hoho'] ],
  [ '$FASTIFY_GET', { url: '/', handler: async () => 'hoho' } ],
]
```
