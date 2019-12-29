# @forrestjs/service-postgres

ForrestJS service which helps connecting to a Postgres server.

```js
const { runHookApp } = require('@forrestjs/hooks')
const serviceEnv = require('@forrestjs/service-env')
const serviceLogger = require('@forrestjs/service-logger')
const servicePostgres = require('@forrestjs/service-postgres')

runHookApp({
    settings: async ({ getEnv, setConfig }) => {
        setConfig('postgres.connections', [{
            connectionName: 'default',
            host: getEnv('PG_HOST'),
            port: getEnv('PG_PORT'),
            database: getEnv('PG_DATABASE'),
            username: getEnv('PG_USERNAME'),
            password: getEnv('PG_PASSWORD'),
            maxAttempts: Number(getEnv('PG_MAX_CONN_ATTEMPTS', 25)),
            attemptDelay: Number(getEnv('PG_CONN_ATTEMPTS_DELAY', 5000)),
            models: [], // optional
        }])
    },
    services: [
        serviceEnv,
        serviceLogger,
        servicePostgres,
    ],
}).catch(err => console.error(err))
```

## Hooks

Initialization hooks are synchronous:

- (sync) POSTGRES_BEFORE_INIT
- (sync) POSTGRES_BEFORE_INIT/{connectionName}
- (sync) POSTGRES_AFTER_INIT/{connectionName}
- (sync) POSTGRES_AFTER_INIT

Start hooks are asynchronous and run in serie

- (serie) POSTGRES_BEFORE_START
- (serie) POSTGRES_BEFORE_START/{connectionName}
- (serie) POSTGRES_AFTER_START/{connectionName}
- (serie) POSTGRES_AFTER_START

## Troubleshooting

`service-postgres` depends on `service-logger`, install it.
