# @forrestjs/service-hash

ForrestJS service which helps hashing stuff with bcrypt.

## Usage

`service-hash` decorates the _Hooks App Context_ with a `hash.encode()` and `hash.compare()` helpers:

```js
const hooks = require('@forrestjs/hooks')
hooks.registerAction({
    hook: hooks.FINISH,
    handler: async (args, ctx) => {
        const encoded = await ctx.hash.encode('foo')
        console.log(encoded)

        const isValid = await ctx.hash.compare('foo', encoded)
        console.log(isValid)
    },
})
```

After the _Hooks App_ initializes, you can simply import the helpers and use it straight:

```js
const { encode, compare } = require('@forrestjs/service-jwt')

const encoded = await ctx.hash.encode('foo')
const isValid = await ctx.hash.compare('foo', encoded)
```

## Configuration

**NOTE:** the `salt` setting is optional, if not provided, a new salt will be generated at boot time
and logged out as "info" message.

## Environment

**NOTE:** it is important to list `service-hash` _AFTER_ `service-env` so that any kind of environment
configuration is available to be used.

```bash
HASH_ROUNDS=5
HASH_SALT=xxx
```

## Config

```js
registerAction({
    hook: SETTINGS,
    handler: ({ setConfig }) => {
        setConfig('jwt.rounds', 5)
        setConfig('jwt.salt', '$2a$05$EWFE8/77wXdbYuzyx9Golu')
    }
})
```
