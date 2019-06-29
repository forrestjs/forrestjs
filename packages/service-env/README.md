# @forrestjs/service-env

ForrestJS service which helps importing environment variables from `.env.*` files:

- .env
- .env.local
- .env.{NODE_ENV}
- .env.{NODE_ENV}.local

We suggest you write your safe default values in a `.env` file which gets committed into
your version control, then gitignore the `*.local` files and use them to store variables
that are bound to the execution context (your laptop, a production server).

> When things work in the best possible way, `.env.development` should contain all the info
> that allow a new developer to **boot the app in development mode** on her machine.

## Usage

This service injects a `getEnv()` method into the Hooks App execution context:

```js
const { runHookApp, FINISH } = require('@forrestjs/hooks')

runHookApp({
    services: [
        require('@forrestjs/service-env'),
    ],
    features: [
        [FINISH, (args, ctx) => console.log(getEnv('FOO'), 'default for "foo"')]
    ]
})
```

After the Hooks App gets initialized, you can also directly import `getEnv()`:

```js
const { getEnv } = require('@forrestjs/service-env')
```


