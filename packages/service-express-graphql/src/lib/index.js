import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import expressGraphql from 'express-graphql'
import { createHook } from '@forrestjs/hooks'
import { EXPRESS_ROUTE } from '@forrestjs/service-express'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_SCHEMA } from './hooks'

const info = {
    description: 'Provides info regarding the project',
    type: GraphQLString,
    resolve: () => `GraphQL is working`,
}

export const createGraphQLHandler = async (settings) => {
    const isDev = [ 'development', 'test' ].indexOf(process.env.NODE_ENV) !== -1

    const queries = {
        info,
        ...(settings.queries ? settings.queries : {}),
    }
    const mutations = {
        info,
        ...(settings.mutations ? settings.mutations : {}),
    }
    const config = {
        graphiql: isDev,
        ...(settings.config ? settings.config : {}),
    }

    await createHook(EXPRESS_GRAPHQL, {
        async: 'serie',
        args: {
            queries,
            mutations,
            config,
            settings,
        },
    })

    const schema = {
        query: new GraphQLObjectType({
            name: 'RootQuery',
            fields: queries,
        }),
        mutation: new GraphQLObjectType({
            name: 'RootMutation',
            fields: mutations,
        }),
    }

    await createHook(EXPRESS_GRAPHQL_SCHEMA, {
        async: 'serie',
        args: { schema },
    })

    return expressGraphql({
        ...config,
        schema: new GraphQLSchema(schema)
    })
}

export const register = ({ registerAction, ...props }) => {
    // register the basic GraphQL api
    registerAction({
        hook: EXPRESS_ROUTE,
        name: EXPRESS_GRAPHQL,
        trace: __filename,
        handler: async ({ app, settings }) => {
            const { mountPoint } = settings.graphql || {}
            app.use(mountPoint || '/api', await createGraphQLHandler(settings.graphql || {}))
        },
    })

    // register the testing extension
    if (process.env.NODE_ENV !== 'production') {
        require('./test').register({
            registerAction,
            ...props,
        })
    }
}
