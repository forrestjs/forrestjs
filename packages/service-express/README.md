# @forrestjs/service-express

ForrestJS service which helps setting up an ExpressJS server.

## Install & Setup

```bash
npm install --save @forrestjs/service-express
```

set it up in your ExpressJS App:

```js
// index.js
const { runHookApp } = require('@forrestjs/hooks')
const { EXPRESS_ROUTE, ...expressService } = require('@forrestjs/service-express')

// Create an Home Page for the Web App
const homePageRoute = (req, res) => res.send('Hello World')
const homePageAction = ({ registerRoute }) => registerRoute.get('/', homePageRoute)

// Run the app:
runHookApp({
    settings: {
        express: {
            port: 8080,
        },
    },
    services: [
        expressService,
    ],
    features: [
        [ EXPRESS_ROUTE, homePageAction ],
    ],
})
```

## Configuration & ENVs

### port

`express.port: 5000` sets up the port on which the server runs.

It falls back to environment variables:

- process.env.REACT_APP_PORT
- process.env.PORT
- 8080 (default value)

## Hooks

All the hooks exposed by `service-express` are _asynchronous_ and executes in _serie_.

### EXPRESS_HACKS_BEFORE

This hook fires before any other step.<br>
It receives a direct referenct to the `app` and the `server`.

### EXPRESS_MIDDLEWARE

This hook is good to inject custom App level middleware.

```js
const { EXPRESS_MIDDLEWARE } = require('@forrestjs/service-express')

registerAction({
    hook: EXPRESS_MIDDLEWARE,
    handler: ({ registerMiddleware }) =>
        registerMiddleware((req, res, next) => {
            req.data = 'foo'
            next()
        })
})
```

### EXPRESS_ROUTE

```js
const { EXPRESS_ROUTE } = require('@forrestjs/service-express')

registerAction({
    hook: EXPRESS_ROUTE,
    handler: ({ registerRoute }) =>
        registerRoute('get', '/', (req, res) => {
            res.send('Hello World')
        })
})
```

### EXPRESS_HANDLER

This hook is good to inject custom handlers or fallback routes that you
want to be sure fire after any other.

```js
const { EXPRESS_HANDLER } = require('@forrestjs/service-express')

registerAction({
    hook: EXPRESS_HANDLER,
    handler: ({ registerHandler }) =>
        registerHandler((err, req, res, next) => {
            req.send(err)
        })
})
```

### EXPRESS_HACKS_AFTER

This hook fires after any other step.<br>
It receives a direct referenct to the `app` and the `server`.
