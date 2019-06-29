# @forrestjs/service-jwt

ForrestJS service which helps handling jwt activities. More or less it provides
a _Promise_ wrapped `jsonwebtoken` module.

## Usage

`service-jwt` decorates the _Hooks App Context_ with a `jwt.sign()` and `jwt.verify()` helpers:

```js
const hooks = require('@forrestjs/hooks')
hooks.registerAction({
    hook: hooks.FINISH,
    handler: async (args, ctx) => {
        const token = await ctx.jwt.sign({ foo: 123 })
        console.log(token)

        const data = await ctx.jwt.verify(token)
        console.log(data)
    },
})
```

After the _Hooks App_ initializes, you can simply import the helpers and use it straight:

```js
const { sign, verify } = require('@forrestjs/service-jwt')

const token = await sign({ foo: 123 })
const isValid = await verify(token)
```

## Configuration

## Environment

**NOTE:** it is important to list `service-jwt` _AFTER_ `service-env` so that any kind of environment
configuration is available to be used.

```bash
JWT_SECRET=xxx
JWT_DURATION=1y
```

## Config

```js
registerAction({
    hook: SETTINGS,
    handler: ({ setConfig }) => {
        setConfig('jwt.secret', 'your-safe-secret')
        setConfig('jwt.duration', '1y')
    }
})
```

## Methods

### sign(payload, [ settings{}, customSecret ])

`settings` can use whatever you would pass to `jsonwebtoken`. The property
`expiresIn` is defaulted to the global `duration` setting.

`customSecret` is defaulted to the global `secret` setting.

### verify(token, [ customSecret ])

`customSecret` is defaulted to the global `secret` setting.

It resolves with the token's decoded content or throws an error in case it it
not valid.
