# @forrestjs/service-express-graphql

ForrestJS service which sets up a _GraphQL_ endpoint in your _ExpressJS_ App.

```js
const { runHookApp } = require('@forrestjs/hooks')
const { registerAction, SETTINGS } = require('@forrestjs/hooks')

registerAction([ SETTINGS, ({ settings }) => {
    settings.express = {
        graphql: {
            mountPoint: '/api',

            // override any configuration you can pass to `express-graphql`
            config: {
                graphiql: true,    // default "true" if not production 
                context: { ... },  // default "req" object, probably better to keep it that way
            },

            // you can provide a list of middlewares that will be executed
            // before the `express-graphql` extension
            middlewares: [],

            // setup the test query wrapper
            testIsEnabled: true,
            testIsValid: (token, req) => (token === 'xxx'),
        },
    },
}])

runHookApp([
    require('@forrestjs/service-express'),
    require('@forrestjs/service-express-graphql'),
]);
```

## Add a query/mutation to the graph:

```js
const { EXPRESS_GRAPHQL } = require('@forrestjs/service-express-graphql')
const { GraphQLList, GraphQLString } = require('graphql')

const welcomeQuery = ({ queries }) => 
    queries.welcome = {
        description: 'Welcome the user with a custom name',
        args: {
            name: {
                type: GraphQLString,
                defaultValue: 'user',
            },
        },
        type: new GraphQLList(GraphQLString),
        resolve: (_, args, req) => [
            `Welcome, ${args.name}!`,
            req.protocol + '://' + req.get('host') + req.originalUrl,
        ],
    }

export default [ EXPRESS_GRAPHQL, welcomeQuery ]
```

## Test Queries

The idea behind test queries is to provide an API for running maintenance tasks
from the test environment, something like:

```
beforeEach(runQuery(
    mutation resetDB {
        test (token: 'foo') {
            resetDB
        }
    }
))
test(runQuery(
    mutation signup {
        signup (
            email: 'xxx@foo.com',
            passw: 'yyy,
        )
    }
))
```

In order to add queries or mutations into the test wrapper you can register an
action similar to the normal queries:

```js
registerAction([ EXPRESS_GRAPHQL_TEST, ({ queries, mutations }) => {
    queries.foo = { ... }
    mutations.resetDB = { ... }
}])
```

Any test query is automatically disabled in `NODE_ENV=production`, and when they work
in any other environment (dev or test), you need to provide some form of validation
for the package to run the test requests.

1. you need to set `testIsEnabled=true` in the general configuration.
2. you need to provide a `testIsValid()` function that validates each request

The wrapper query accepts a **single optional string argument** called `token` that is forwarded
to the `testIsValid(token, req)` function. You can perform a static validation, or you and
add any kind of middleware that modifies the `req` object, and use it to perform complex
validation logic.

If `testIsValid(token, req)` need to prevent any testing query from running should either
return `false` or raise an exception. It can also return a promise that you resolve or reject.

## Regenerate the GraphQL Schema

The entire `express-graphql` middleware is cached in memory to boost performances, but
you can force a full rebuild of it by bumping its cache key using a middleware:

```js
(req, res, next) => {
    if (isNeeded) {
        req.bumpGraphQL()
    }
    next()
}
```

You can also control the specific ETAG value by setting it:

```js
(req, res, next) => {
    if (isNeeded) {
        req.bumpGraphQL(33)
    }
    next()
}
```

