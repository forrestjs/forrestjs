# @forrestjs/service-express-cookies

ForrestJS service which helps handling cookies in an ExpressJS server.

## Usage

This extension decorates the `req` and `res` object in an `ExpressJS` request.
Use the methods as in the following example to read/write to cookies.

```js
// Server Side Cookies
res.setAppCookie('cookieName', 'value')
res.deleteAppCookie('cookieName')
req.getAppCookie('cookieName') // -> value

// Client Accessible Cookies
res.setClientCookie('cookieName', 'value')
res.deleteClientCookie('cookieName')
req.getClientCookie('cookieName') // -> value
```

**AppCookies** can not be accessed by the client and go in `https-only` by default
when `NODE_ENV=production`.

**ClientCookies** can be accessed by the client and therefore are not super safe.
_Use those with caution_.

## Configuration

```js
registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {
        settings.express = {
            cookieHelper: {
                scope: 'XXX',
                duration: '30d',
            }
        }
    },
})
```

`scope` is a string that prefix any cookie name you will ever use. It's cool to work
on multiple apps in development and still avoid conflicts ;-)


