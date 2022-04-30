# @forrestjs/service-fetchq

## ForrestJS FetchQ Service

Minimalist FetchQ wrapper that sets up a FetchQ client and injects it into
the app's context.

```js
const forrestjs = require('@forrestjs/core');
const serviceEnv = require('@forrestjs/service-env');
const serviceLogger = require('@forrestjs/service-logger');
const serviceFetchq = require('./service/service-fetchq');

const settingsHandler = ({ setConfig, getEnv }) =>
  setConfig('fetchq', {
    logLevel: 'info',
    connectionString: 'postgres://user:pass@host:port/db',
    skipExtension: true,
    queues: [
      {
        name: 'queue_name',
        isActive: true,
        enableNotifications: true,
      },
    ],
  });

forrestjs.run({
  trace: 'compact',
  settings: settingsHandler,
  services: [serviceEnv, serviceLogger, serviceFetchq],
});
```
