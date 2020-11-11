# @forrestjs/service-express-graphql

ForrestJS service which sets up a _GraphQL_ endpoint in your _ExpressJS_ App.

```js
const { runHookApp } = require('@forrestjs/hooks')
const { GraphQLString } = require('graphql')

runHookApp({
    settings: {
        expressGraphql: {
            mountPoint: '/api',
            queries: {
                info: {
                    type: GraphQLString,
                    resolve: () => 'Hello World Query',
                },
            },
            mutations: {
                info: {
                    type: GraphQLString,
                    resolve: () => 'Hello World Mutation',
                },
            },
        },
    },
    services: [
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-graphql'),
    ],
});
```

## Configuration

### mountPoint

String, where to mount the GraphQL api. Defaults to `/api`.

### middlewares

Array, a list of middlewares to run before the `express-graphql`.
This is useful if you wish to customize the `body-parser` or stuff like that.

### queries, mutations

Objects, provide the queries and mutations for the GraphQL schema. You can also
use a hook to do so, it's explained later on in this file.

### config

Object, provide custom configuration to `express-graphql`.

## Add a query/mutation to the graph:

Here is an example of a feature that extends the GraphQL schema and provides a really
advances page counter (really old school):

```js
const { GraphQLString } = require('graphql');

const pageViews = ({ registerQuery, registerMutation }) => {
    let hits = 0
    registerQuery('getPageView', {
        type: GraphQLInt,
        resolve: () => hits,
    })
    registerMutation('logPageView', {
        type: GraphQLInt,
        resolve: () => (hits += 1),
    })
};

export default [ '$EXPRESS_GRAPHQL', pageViews ];
```

## Regenerate the GraphQL Schema on the fly

The entire `express-graphql` middleware is cached in memory to boost performances, but
you can force a full rebuild of it by bumping its cache key using a middleware:

```js
(req, res, next) => {
  if (isNeeded) {
    req.bumpGraphqlETAG();
  }
  next();
};
```

You can also control the specific ETAG value by setting it:

```js
(req, res, next) => {
  if (isNeeded) {
    req.bumpGraphqlETAG(33);
  }
  next();
};
```
