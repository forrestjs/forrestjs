# Change Log

## v4.0.0

- Remove Babel
- Add support for healtz preHandler checks

## v1.13.2

Allows to return the route handler from the hooks' hander

```js
const featureCustomHealthz = [
  '$FASTIFY_HEALTHZ_HANDLER',
  () => (req, res) => res.send('ok - custom handler'),
];
```

is the shorthand for:

```js
const featureCustomHealthz = [
  '$FASTIFY_HEALTHZ_HANDLER',
  ({ registerHandler }) =>
    registerHandler((req, res) => res.send('ok - custom handler')),
];
```

**NOTE:** Only the first registered hook will be used and the utilization of `registerHandler`
API will overrides any shorthand returned value.
