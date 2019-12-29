# @forrestjs/hooks

ForrestJS Hooks helps you splitting your Apps into small and reusable
**components that can extend each other** in a gentle and controlled fashion.

Yes, it is a **simple plugin system** inspired by the way Wordpress works.<br>
But traceable and fully debuggable.

```js
import { registerAction, createHook } from '@forrestjs/hooks'

// This is a basic "extension"
registerAction('extendDoSmthCool', () => {
    console.log('Inject even more cool stuff')
})

// This function implements an "extension point"
const doSmthCool = () => {
    console.log('First cool thing')
    createHook('extendDoSmthCool')
    console.log('Another cool thing')
}

doSmthCool()
```

If you run the code above you get:

```bash
First cool thing
Inject even more cool stuff
Another cool thing
```

The cool part is that it **supports both synchronous and asynchronous extension points**,
and that an asynchronous extension point can **run in both series or parallel**.

## Install & Setup

    npm install @forrestjs/hooks

There is no setup. Just enjoy it!

## Names of Things

An **extension point** or **hook** is a controlled way to let external code
**inject some business logic** in your function.

An **extension** or **action** declare the intention to run a specific function
when a hook gets executed. It uses the name of the hook as reference.

## Create a Hook (or Extension point)

Say you want to build an ExpressJS website. Exciting, right?

In the past you would have to list all your middlewares and routes in
the server configuration file: `server.js`. I did that so many times!

But with `hooks` things gets a little bit easier because you can simply let your
App **open for extensions** that come from modules you haven't yet thought of:

```js
// server.js
import express from 'express'
import { createHook } from '@forrestjs/hooks'

// Setup a basic Express app:
const app = express()
app.get('/', (req, res) => res.send('hello world'))

// Allow extensions to inject new routes:
const registerRoute = (route, fn) => app.get(route, fn)
createHook.sync('express/routes', { registerRoute })

// Allow extensions to alter a simple value in waterfall:
const port = createHook.waterfall('express/port', 8080).value

app.listen(port)
```

👉 read also: [`createHook()` api](./docs/create-hook.md)

## Register an Action

Now your new marketing department is asking you for a new landing page that should
answer to the `/mighty-offer` route.

In the old days you would have needed to hack into `server.js` and change it to add the
route. Oh well... With `hooks` you can work this issue out without touching the rest of
your app:

```js
// mighty-offer.js
import { registerAction } from '@forrestjs/hooks'

registerAction({
    name: 'mightyOffer',
    hook: 'express/routes',
    handler: ({ registerRoute }) => {
        registerRoute('/mighty-offer', (req, res) => {
            res.send('oh boy, you should buy this and that and more...')
        })
    },
})
```

Then you simply need to `import` your new extension before `server.js`:

```js
// index.js
require('./mighty-offer')
require('./server')
```

That's it!

If you want to add an extension that changes the default port `8080` you should write
something like that in `index.js`:

```js
const customPort = () => 5050
require('@forrestjs/hooks').registerAction('express/port', customPort)

// rest of the code...
```

👉 read also: [`registerAction()` api](./docs/register-action.md)

## How to know what is going on in an App like that?

The obvious drawback of this _indirect code injection_ approach is that you could easily loose
control over the **"what the hell is going on in my app"**.

What hooks into what?

Don't you worry, we have this covered. Add this to your `index.js`:

```js
// rest of the code...

const { traceHook } = require('@forrestjs/hooks')
console.log('Boot Trace:')
console.log('=================')
console.log(traceHook()('compact')('cli').join('\n'))
```

You should see something like that:

```bash
Boot Trace:
=================
mightyOffer » express/routes
customPort » express/port
```

I'm building a basic web app with an ExpressJS server, a GraphQL endpoint, a Postgres connection
manager plus few other services.

Here is what I see when I run the `traceHook()`:

```bash
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
```

- You can read each line as `X hooks into Y`, where `Y` is the hook name and `X` is the extension name.
- The vertical order is the sequence in which each hook is triggered. 
- The indentation represents nested hooks.

(The little icons are part of the `runHookApp()` utility that we cover in the next paragraph.=

I find this visualization quite simple to follow. But if you want an extensive reporting you should try:

```js
const fullTrace = traceHook()('full')('json')
console.log(fullTrace)
```

👉 read also: [`traceHook()` api](./docs/trace-hook.md)


## Scaffold a Full Hooks App

This paragraph is going to cover a utility that **provides a Hook based lifecycle** for
developing a generic backend application. Long story short it helps you 
**packaging extension into reusable features**.

Here is the examples we saw so far, packaged as a `runHookApp()`:

```js
const { runHookApp } = require('@forrestjs/hooks')
const { INIT_SERVICES, START_SERVICES } = require('@forrestjs/hooks')

// This service runs a simple Express server that can be extended
// by other services or features.
const express = require('express')
const expressService = ({ registerAction }) => {
    const name = 'express'
    const app = express()

    const registerRoute = (route, fn) => app.get(route, fn)
    const registerMiddleware = (mountPoint, fn) => app.use(mountPoint, fn)

    registerAction({
        name,
        hook: INIT_SERVICES,
        handler: async ({ createHook, getConfig }) => {
            await createHook.serie(expressService.EXPRESS_MIDDLEWARES, { registerMiddleware })
            await createHook.serie(expressService.EXPRESS_ROUTES, { registerRoute })
        },
    })
    
    registerAction({
        name,
        hook: START_SERVICES,
        handler: ({ getConfig }) => {
            const port = getConfig('express.port', 8080)
            app.listen(port, () => console.log(`Express listening on: ${port}`))
        },
    })
}

// It is always a good idea for a service to export its hooks, so that other
// features can use those symbols instead of strings. Strings can lead to mispells.
expressService.EXPRESS_MIDDLEWARES = `express/middlewares`
expressService.EXPRESS_ROUTES = `express/routes`

// This is just an extension handler, it needs to be packaged into an
// "immediate feature" (see later in the code when we "runHookApp()")
const homePageRoute = ({ registerRoute }) =>
    registerRoute('/', (req, res) => {
        res.send('Home!')
    })

// This feature rely on some configuration to be provided, and can
// conditionally register actions based on the app settings.
const mightyOfferFeature = ({ registerAction, getConfig }) => {
    getConfig('mightyOffer.enabled') && registerAction({
        name: 'mightyOffer',
        hook: expressService.EXPRESS_ROUTES,
        handler: ({ registerRoute }) => {
            registerRoute('/offer', (req, res) => {
                res.send(`mighty offer... only for today ${getConfig('mightyOffer.price')}$!!!`)
            })
        }
    })
}

runHookApp({
    // optional debug helper
    // try also "full"
    trace: 'compact',

    // settings can be just an object, or an sync/async function
    settings: async ({ setConfig }) => {
        setConfig('express.port', 5050)
        setConfig('mightyOffer.enabled', true)
        setConfig('mightyOffer.price', 5000)
    },

    // services can do some cool stuff that features can't ;-)
    // they boot before features, so features can count on stuff
    // that is provided by the services.
    services: [
        expressService,
    ],

    // package your business values into small feature that is easy
    // to work with. 
    features: [
        [ expressService.EXPRESS_ROUTES, homePageRoute ],
        mightyOfferFeature,
    ],
}).catch(err => console.error(err))
```

I would normally split this code into multiple files:

- `express-service.js` 
- `home-route.js` (woule export the array we have in `features`)
- `mighty-offer.js`
- `index.js` would run stuff and provide the configuration

With this setup a complex application can be takled by a large team with
people working in paralle on clearly separated features.

## Reference Hooks by Name

A feature/service may register its hooks inside the hook app so that other
services/features may refer to them by name instead of importing constants:

```js
const service1 = ({ registerHook, registerAction, createHook }) => {
    
    // Register the feature's hooks within the App's context
    registerHook({ S1_START: 's1' })

    registerAction({
        hook: '$START_SERVICE',
        handler: () => createHook.sync('s1')
    })
}

// feature1 try to hook into "service1 > S1_START" using a
// **strict reference**, the app would crash if that hook was not registersd
const feature1 = ['$S1_START', () => { ... }]

// feature2 try to hook into "service1 > S1_FOO" using a
// **loose reference**, that hook does not exists, so the action is ignored
const feature2 = ['$S1_FOO?', () => { ... }]

runHookApp({
    trace: 'compact',
    services: [
        service2,
    ],
    features: [
        feature1,
        feature2,
    ],
}).catch(err => console.error(err))
```

