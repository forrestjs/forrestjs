# Change Log

## v1.13.4

## registerAction accepts scalars as "handler"

```js
const featureX = ({ registerAction }) => registerAction({
  hook: '$FASTIFY_ROUTE',
  handler: {
    method: 'GET',
    url: '/x',
    handler: async () => 'xxx'
  }
})
```

## v1.13.1 2019-08-04

### Accepts plain objects as handlers

Hook's handler in a `createHookApp` can be defined as plain objects:

```js
features: [ '$HOOK_NAME', { foo: 123 } ]
```

it's a shorthand signature for classic:

```js
features: [ '$HOOK_NAME', () => ({ foo: 123 }) ]
```

### Accepts string as array signature option for a feature

```js
features: [ '$HOOK_NAME', { foo: 123 }, 'fooBar' ]
```

it's a shorthand signature for classic:

```js
registerAction({
  hook: '$HOOK_NAME',
  name: 'fooBar',
  handler: () => ({ foo: 123 })
})
```


## 2019-06-28

Huge non retro-compatible refactor that aims to make the API stable
and very decent to use.

Introduced the "waterfall" mode.

