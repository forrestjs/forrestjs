# @forrestjs/service-express

ForrestJS service which helps setting up an ExpressJS server.

> Here is a good tutorial:<br>
> https://forrestjs.github.io/howto/hooks.html

## Install & Setup

```bash
npm install --save @forrestjs/service-express
```

set it up in your ExpressJS App:

```js
// index.js
const { runHookApp } = require('@forrestjs/hooks')
const { EXPRESS_ROUTE, ...expressService } = require('@forrestjs/service-express')

// Create custom routes:
const featureSum = ({ app }) =>
    app.get('/', (req, res) => res.send('Hello World'))

// Hack the App together:
runHookApp({
    config: {},
    services: [
        expressService,
    ],
    features: [
        [ EXPRESS_ROUTE, featureSum ],
    ],
})
```

## Configuration & ENVs

```js
runHookApp({
    settings: {
        express: {
            // ... write config here
        },
    },
}
```

### port

`settings.express.port: 5000` sets up the port on which the server runs.

It falls back to environment variables:

- settings.express.port
- process.env.REACT_APP_PORT
- process.env.PORT
- 8080 (default value)

## Hooks

All the hooks exposed by `service-express` are _asynchronous_ and executes in _serie_.

The arguments you receive are:

- `app`: the ExpressJS app object
- `server`: the http server instance (useful for SocketIO or similar stuff)
- `settings`: a shallow copy of the settings, ment to be read-only

### EXPRESS_INIT

```js
require('@forrestjs/service-express').EXPRESS_MIDDLEWARE
```

This hook fires before any other step.<br>
You have just a plain ExpressJS App object here.

### EXPRESS_MIDDLEWARE

```js
require('@forrestjs/service-express').EXPRESS_MIDDLEWARE
```

This hook is good to inject custom App level middleware.<br>
Mind that "compression" and "helmet" are already provided

### EXPRESS_ROUTE

```js
require('@forrestjs/service-express').EXPRESS_ROUTE
```

### EXPRESS_HANDLER

This hook is good to inject custom handlers or fallback routes that you
want to be sure fire after any other.

```js
require('@forrestjs/service-express').EXPRESS_HANDLER
```
