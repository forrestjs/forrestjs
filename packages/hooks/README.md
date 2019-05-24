# @forrestjs/hooks

> ForrestJS library which helps decoupling your application into small 
> and reusable modules.

`hooks` is a small plugin / hooks library for NodeJS _and the browser_.
The idea is to enrich your sourcecode with **extension points** that can be used
to **inject code from a different part of the app**.

> yes, it's a simple plugin system inspired by how Wordpress works. But traceable.

The cool part is that it **supports both synchronous and asynchronous extension points**,
and that an asynchronous extension point can **run in both series or parallel**.

## Install & Setup

    npm install @forrestjs/hooks

There is no setup at the moment. Just enjoy it!

## Create a Hook

Say you want to build an ExpressJS website. Exciting, right?

In the past you would have to list all your routes, or links all your routers, in
the server configuration file `server.js`. I did that so many times!

But with `hooks` things gets a little bit easier because you can simply let your
app **open for extensions** that comes from modules you haven't yet thought of:

    import express from 'express'
    import { createHook } from '@forrestjs/hooks'

    // setup Express and add some basic routes
    const app = express()
    app.use('/', (req, res) => res.send('hello world'))

    // allow others to add their routes :-)
    createHook('express/routes', {
        args: { app },
    })

    app.listen(8080)

**☛ read also:**

* [create hook api](./docs/create-hook.md)

## Register an Action

Now your new marketing department is asking you for a new landing page that should
answer to the `/mighty-offer` route.

In the old days you would have needed to hack into `server.js` and change it to add the
route. Oh well... With `hooks` you can work this issue out without touching the rest of
your app:

    /* mighty-offer.js */

    import { registerAction } from '@forrestjs/hooks'

    registerAction({
        hook: 'express/routes',
        name: action: 'mighty-offer',  // optional, but good for tracing
        trace: __file,                 // optional, but good for tracing
        handler: (args) => {
            args.app.use('/mighty-offer, (req, res) => {
                res.send('oh boy, you should buy this why, why and because...)
            })
        },
    })

Then you simply need to `import` your new extension before `server.js`.  
That's it!

**☛ read also:**

* [register action api](./docs/register-action.md)

## What is going on?

The obvious drawback of this indirect extension approach is that you could easily loose
control over the **what the hell is going on in my app**.

You have now created **tens of modules that register into tens of hooks** and you have a bug. Don't crush your head on the wall! (not just yet)

    import { traceHook } from '@forrestjs/hooks'

    console.log('Boot Trace:')
    console.log('=================')
    console.log(traceHook()('compact')('cli').join('\n'))

I have a basic app with an ExpressJS server, a GraphQL endpoint, a Postgres connection
manager plus few other services.

Here is what I see when I run that command:

    Boot Trace:
    =================
    → env ◇ start
    → logger ◇ start
    ◇ settings ◇ settings
    → hash ◇ init::services
    → jwt ◇ init::services
    → postgres ◇ init::services
    → express/graphql-test ◇ init::services
    → express ◇ init::services
      → express/cookie-helper → express/middlewares
      → express/device-id → express/middlewares
      → express/graphql → express/routes
        → express/graphql-test → express/graphql
          ▶ fii → express/graphql-test
        ▶ fii → express/graphql
      ▶ fii → express/routes
    → express/ssr → express/routes
    → postgres ◇ start::services
    → express ◇ start::services
    ◇ boot ◇ finish

You can read each line as `X mounts on Y`, where `Y` is the hook and `X` is the extension.

The vertical order is the sequence in which each hook is triggered.  
The indentation represents nested hooks.

I find this visualization quite simple to follow. Try also:

    traceHook()('full')('json')

for a complete tracing of your application shape!

**☛ read also:**

* [trace hook api](./docs/trace-hook.md)


## Scaffold a Full App

This little piece of code:

    import { createHookApp } from '@forrestjs/hooks'

    // Describe an App:
    const app = createHookApp({
        settings: { cwd: process.cwd() },
        services: [
            require('./my-service-1),
            require('./my-service-2),
        ],
        features: [
            require('./my-feature-1),
            require('./my-feature-2),
        ],
    })

    // Boot the App:
    app()
        .then(() => console.log('App started'))
        .catch(err => console.error(err))

Each module, being it a `service` or a `feature` **should export** a `register()` method
that will be used by `createHookApp`.

An example of `my-feature1.js` might be:

    const init = async () => { ... }
    const injectExpressHeaders = ({ app }) => { ... }

    export const register = ({ registerAction }) => {
        registerAction({ hook: '◇ init::services', handler: init })
        registerAction({ hook: '→ express/middlewares', handler: injectExpressHeaders })
        ...
    }

A `service` or a `feature` becomes a simple collection of hooks. They work exactly the same
but they have a very different meaning:

- a **service provides infrastructural stuff**  like a server, a db connection, a cache system, ...
- a **feature provides business value** like a login, a signup, a validate promo code, ...

There are a bounch of hooks that are provided by `createHookApp` and you can find a
comprehensive list in the [create hook app api page](./docs/create-hook-app.md).

**☛ read also:**

* [create hook app api](./docs/create-hook-app.md)
