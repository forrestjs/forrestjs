# @forrestjs/service-express-cookies

ForrestJS service which helps handling cookies in an ExpressJS server.

## Usage

This extension decorates the `req` and `res` object in an `ExpressJS` request.
Use the methods as in the following example to read/write to cookies.

```js
// Server Side Cookies
res.setCookie('cookieName', 'value', { /* override options */ })
res.deleteCookie('cookieName')
req.getCookie('cookieName') // -> value

// Client Side Cookies
res.setClientCookie('cookieName', 'value', { /* override options */ })
res.deleteClientCookie('cookieName')
req.getClientCookie('cookieName') // -> value
```

**AppCookies** can not be accessed by the client and go in `https-only` by default
when `NODE_ENV=production`.

**ClientCookies** can be accessed by the client and therefore are not super safe.
_Use those with caution_.

The `override options` argument is optional and allow to override any pre-configured
setting that is passed down to `res.cookie`. 

**NOTE:** `maxAge` can be set as string like `5 minutes` and gets parsed by
[millisecond](https://www.npmjs.com/package/millisecond).

## Configuration

```js
const { runHookApp } = require('@forrestjs/hooks')

runHookApp({
    settings: {
        express: {
            port: 8080,
        },
        expressCookies: {
            scope: 'XXX',
            secure: false,
            httpOnly: true,
            duration: '30d',
            separator: '::',
            clientDuration: '30d',
            clientSeparator: '--',
        }
    },
    services: [
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-cookies'),
    ],
    features: [
        ({ getHook }) => [getHook('EXPRESS_ROUTE'), ({ registerRoute }) => {
            registerRoute.get('/', (req, res) => {
                res.setCookie('foo', 123)
                res.setClientCookie('foo', 123)
                res.send('ok')
            })
        }]
    ]
})
```

## scope

`scope` is a string that prefix any cookie name you will ever use. It's cool to work
on multiple apps in development and still avoid conflicts ;-)

## secure

Forces cookies to apply only to `https` connections.

default: `isDevOrTest ? false : true`

> it applies to Server Side cookies only

## httpOnly

Hides cookies from client side access.

default: `true`

> it applies to Server Side cookies only

## duration

default: `300y`

## separator

default: `::`

## clientDuration

default: ${duration}

## clientSeparator

default: `--`
