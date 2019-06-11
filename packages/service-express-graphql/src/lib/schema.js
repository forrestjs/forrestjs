import { createHook } from '@forrestjs/hooks'
import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_SCHEMA } from './hooks'

export const makeSchema = async ({ queries, mutations, config, settings }) => {
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

    return new GraphQLSchema(schema)
}