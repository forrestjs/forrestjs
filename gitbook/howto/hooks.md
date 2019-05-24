# Hooks - A truly modular NodeJS App

Writing apps in NodeJS is fun and quite easy.

`require()` and `import` are the building blocks for **structuring your codebase 
in modules** and let them talk with each other. [NPM](https://npmjs.com) let you 
share and reuse bigger blocks of logic. Great stuff.

Nevertheless, it's always beed a struggle to organize our codebase into blocks that
represent relevant business logic. So to speak, **features that a customer is
willing to pay for**.

Here is a simplicistic implementation of an app that should be able to
**sum two integers**:

```js
const express = require('express')
const app = express()
const port = process.env.PORT || 8080

app.get('/:p1/:p2', (req, res) => {
    const { p1, p2 } = req.params
    const sum = Number(p1) + Number(p2)
    res.send(`${p1} + ${p2} = ${sum}`)
})

app.listen(port, () => console.log('Running...'))
```

This works and it is not much code, but if you focus on the business requirement:

> sum two integers

you quikly find out that the only relevant piece of code would be:

```js
const sum = Number(p1) + Number(p2)
```

Ok, this is quite a strict interpretation. Let's say that the code that is relevant
to the business requirement is more likely something like this:

![Business related code](../images/hooks-server-code1.png)

after all, all we want to achieve is something like that:

![Final result](../images/hooks-server-app1.png)

If you are a little bit like me, you find yourself writing - or copying -
_Express_ (or _Koa_ or whatever...) setup scripts over and over, project by
project.

This structural code has the following charateristics:

1. it is almost always the same
2. it doesn't contribute to the business requirement
3. nothign work without it

## WordPress almost nailed it...

Engineers at WordPress found out long time ago that **the value of a platform roots
in its capablity to run external plugins**. WordPress wouldn't be WordPress without
a rich plugins echosystem.

WordPress provides you with some _core functionalities_ and a huge amount of
**extension points**. You can write a file that basically asks WP to:

> When "X" happens, please run my code

And this is the good side of it.

You can pack your business logic in a plugin (or theme) that runs on top of all the
"stuff" of which WordPress is made. Stuff that you and me don't even need to care 
so much.

The flipside is that you have plugins that hook into WordPress, plugins that hook into
plugins that hook into WordPress... and so on.

**It is a hard job to trace and debug plugin composability.**

## Welcome `@forrestjs/hooks` :-)

`@forrestjs/hooks` is a small library that enable **traceable composability** in your
Javascript application.

With the hooks you can refactor the code we saw earlies into this:

```js
const { runHookApp, createHook, START_SERVICES } = require('@forrestjs/hooks')

const expressService = () => {
    const express = require('express')
    const app = express()
    const port = process.env.PORT || 8080

    // Allows for other features to hook into
    // the Express app and provide their own custom logic
    createHook('express', { args: { app }})

    app.listen(port, () => console.log('Running...'))
}

const featureSum = ({ app }) =>
    app.get('/:p1/:p2', (req, res) => {
        const { p1, p2 } = req.params
        const sum = Number(p1) + Number(p2)
        res.send(`${p1} + ${p2} = ${sum}`)
    })

runHookApp([
    [ START_SERVICES, expressService ],
    [ 'express', featureSum ],
])
```

Although is a little bit longer, it enables a clear **separation or responsabilities**
between "running express" and "implementing the SUM requirement".

> The most important thing is that you can easily extract `expressService` into
> a standalone NPM module, and reuse it as plain dependency in multiple projects.

As a matter of fact, _ForrestJS_ did exactly that:

```js
const { runHookApp } = require('@forrestjs/hooks')
const { EXPRESS_ROUTE, ...expressService } = require('@forrestjs/service-express')

const featureSum = ({ app }) =>
    app.get('/:p1/:p2', (req, res) => {
        const { p1, p2 } = req.params
        const sum = Number(p1) + Number(p2)
        res.send(`${p1} + ${p2} = ${sum}`)
    })

runHookApp([
    expressService,
    [ EXPRESS_ROUTE, featureSum ],
])

```

This is a perfectly viable NodeJS app that **focuses on implementing the business
requirement** that we discussed previously. (Sum 2 integers, right?)

The mere running of a NodeJS server is nothing we should be concerned about.  
**It should just work (tm) - and it does**.

## What about Traceability?

Well, the thing is that `@forrestjs/hooks` comes with a nice built in feature that
will produce an app boot report similar to this one:

![hooks boot trace](../images/hooks-server-boot-trace.png)

There is just a small change that we have to make to our codebase in order to
achieve this tree rapresentation, and it comes as a built-in service:

```js
const { runHookApp, traceBoot } = require('@forrestjs/hooks')

...

runHookApp([
    traceBoot,
    expressService,
    [ EXPRESS_ROUTE, featureSum ],
])
```

## Enjoy a truly Sharable Infrastructure

Here at _ForrestJS_ we believe you should never be writing the same infrastructural
code twice.

> Worst of all, you should never copy/paste the same code 
> into multiple projects!

That's why we are maintaining a list of common stuff that you can plug into your
application end extend to suit your specific business need:

- [@forrestjs/service-express](https://www.npmjs.com/package/@forrestjs/service-express)
  sets up a basic ExpressJS server and offers some basic extension points.
- [@forrestjs/service-express-graphql](https://www.npmjs.com/package/@forrestjs/service-express-graphql)
- [@forrestjs/service-express-ssr](https://www.npmjs.com/package/@forrestjs/service-express-ssr)
  provides utilities to Server-Side render a React application.
- [@forrestjs/service-postgres](https://www.npmjs.com/package/@forrestjs/service-postgres)
  lets you establish a stable connection toward multiple Postgres databases, and you
  can provide Sequelize models to describe your data.

There are [many other packages already released in NPM](https://www.npmjs.com/search?q=%40forrestjs) under the `@forrestjs` organization.

We are working hard to document them, we are moving our first steps and things can
only improve :-)
