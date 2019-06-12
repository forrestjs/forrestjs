# @forrestjs/service-jwt

ForrestJS service which helps handling jwt activities. More or less it provides
a _Promise_ wrapped `jsonwebtoken` module.

```js
import { sign, verify } from '@forrestjs/service-jwt'

const token = await sign({ foo: 123 })
const isValid = await verify(token)
```

## Configuration

```js
registerAction({
    hook: SETTINGS,
    handler: ({ settings }) => {
        setting.jwt = {
            secret: 'your-safe-secret',
            duration: '1y',
        }
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
