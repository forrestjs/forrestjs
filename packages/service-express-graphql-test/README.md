# @forrestjs/service-express-graphql-test

ForrestJS service which helps injecting some protected queries into the GraphQL Schema.
It is a simple form of protection and should be carefully used,
**it is intended for testing purpose only**.

```js
const { runHookApp } = require('@forrestjs/hooks')
const { GraphQLString, GraphQLInt } = require('graphql')

runHookApp({
    settings: {
        expressGraphqlTest: {
            isEnabled: () => process.env.NODE_ENV === 'development',
            isValid: ({ token }) => token === 'xxx',
        }
    },
    services: [
        require('@forrestjs/service-express'),
        require('@forrestjs/service-express-graphql'),
        require('@forrestjs/service-express-graphql-test'),
    ],
    features: [
        ['$EXPRESS_GRAPHQL_TEST', ({ registerQuery }) => {
            registerQuery('info', {
                type: GraphQLString,
                resolve: () => 'Hello World Query'
            })
            registerMutation('info', {
                type: GraphQLString,
                resolve: () => 'Hello World Mutation'
            })
        }],
    ]
})
```

Try now to query:

```gql
query q1 {
    test( token: "xxx" ) {
        info
    }
}

mutation m1 {
    test( token: "xxx" ) {
        info
    }
}
```

## Settings

### wrapperName

default: `test`

### wrapperDescription

### queryName

default: `TestQuery`

### mutationName

default: `TestMutation`

### isValidError

### queries, mutations

Same mechanism as the GraphQL service.

### isEnabled(hooksContext)

Async function (boolean), defines whether the test queries and mutations should be injected into
the App's GraphQL schema or not.

By default it returns true if `process.env.NODE_ENV` is set to either `development` or `test`,
but this setting is here for you to provide your custom logic.

**NOTE:** this function is fired during the booting of your application, and then avery time
the GraphQL schema cache is flushed.

### isValid(ctx, graphqlContext, hooksContext)

Async function (boolean), it runs at every request and should return `false` or `throw new Error`
in case access to the testing queries should be denied.

## Add a query/mutation to the graph:

```js
const { GraphQLString } = require('graphql');

const testQueries = ({ registerQuery, registerMutation }) => {
    registerQuery('foo', {
        type: GraphQLString,
        resolve: () => 'Hello World Query'
    })
    registerMutation('foo', {
        type: GraphQLString,
        resolve: () => 'Hello World Mutation'
    })
}

export default [ '$EXPRESS_GRAPHQL_TEST', welcomeQuery ];
```
