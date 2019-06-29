# @forrestjs/service-jwt

ForrestJS service which helps handling jwt activities. More or less it provides
a _Promise_ wrapped `jsonwebtoken` module.

```js
import { sign, verify } from '@forrestjs/service-jwt'

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

## sign(payload, [ settings{}, customSecret ])

`settings` can use whatever you would pass to `jsonwebtoken`. The property
`expiresIn` is defaulted to the global `duration` setting.

`customSecret` is defaulted to the global `secret` setting.

## verify(toke, [ customSecret ])

`customSecret` is defaulted to the global `secret` setting.

It resolves with the token's decoded content or throws an error in case it it
not valid.
