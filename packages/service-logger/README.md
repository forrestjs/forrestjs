# @forrestjs/service-logger

ForrestJS service which helps logging stuff in the server. 
It uses [winston](https://www.npmjs.com/package/winston) under the hood.

## Usage

`service-logger` injects a Winston logger instance into the Hooks App context, so you will be able
to access it from any action:

```js
const hooks = require('@forrestjs/hooks')
hooks.registerAction({
    hook: hooks.FINISH,
    handler: (args, ctx) => {
        ctx.logger.info('Test')
    },
})
```

After the Hooks App gets initialized, you can also access some direct logging methods
by importing them directly:

```js
const logger = require('@forrestjs/service-logger')
logger.logInfo('test...')
```

## Configuration

### Environment

**NOTE:** it is important to list `service-logger` _AFTER_ `service-env` so that any kind of environment
configuration is available to be used.

`LOG_LEVEL` should be set according to the [winston docs](https://www.npmjs.com/package/winston#logging-levels)
and it defaults to `info`.

### Config

`logger.level` should be set according to the [winston docs](https://www.npmjs.com/package/winston#logging-levels)
and it default to `process.env.LOG_LEVEL`.

## Provide custom transporters

In order to add your custom transporters you must register your extension as a `service` or as a standalone
hook before running `createHookApp`, as Service Logger hooks into `START` with the purpose of providing
the rest of the app with a viable logging mechanism.

```js
const serviceLogger = require('@forrestjs/service-logger')

registerAction({
    hook: serviceLogger.LOGGER_TRANSPORTS,
    hanlder: ({ registerTransport, winston }) =>
        registerTransport(new winston.transports.Console())
})
```


