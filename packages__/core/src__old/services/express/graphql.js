import { GraphQLSchema, GraphQLObjectType, GraphQLString } from 'graphql'
import expressGraphql from 'express-graphql'
import { createHook } from '@marcopeg/hooks'
import ssr from '../../package.json'
import { EXPRESS_ROUTE, EXPRESS_GRAPHQL } from './hooks'

const info = {
    description: 'Provides info regarding the project',
    type: GraphQLString,
    resolve: () => `${ssr.name} v${ssr.version}`,
}

export const createGraphQLHandler = async () => {
    const isDev = [ 'development', 'test' ].indexOf(process.env.NODE_ENV) !== -1

    const queries = { info }
    const mutations = { info }
    const context = { data: {} }
    const config = {
        graphiql: isDev,
    }

    await createHook(EXPRESS_GRAPHQL, {
        async: 'serie',
        args: {
            queries,
            mutations,
            context,
            config,
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

    return (req, res) => expressGraphql({
        schema: new GraphQLSchema(schema),
        graphiql: config.graphiql,
        context: {
            ...context,
            req,
            res,
        },
    })(req, res)
}

export const register = ({ registerAction }) =>
    registerAction({
        hook: EXPRESS_ROUTE,
        name: EXPRESS_GRAPHQL,
        trace: __filename,
        handler: async ({ app, settings }) => {
            const { mountPoint } = settings.graphql || {}
            app.use(mountPoint || '/api', await createGraphQLHandler())
        },
    })
