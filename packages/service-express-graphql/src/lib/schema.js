import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import { EXPRESS_GRAPHQL, EXPRESS_GRAPHQL_HACK_SCHEMA } from './hooks'

export const makeSchema = async ({ queries, mutations }, { createHook }) => {
    // Extend the existing schema with custom queries and mutations
    await createHook.serie(EXPRESS_GRAPHQL, {
        registerQuery: (key, val) => {
            if (queries[key]) {
                throw new Error(`[express-graphql] Query "${key}" was already defined`)
            }
            queries[key] = val
        },
        registerMutation: (key, val) => {
            if (mutations[key]) {
                throw new Error(`[express-graphql] Mutation "${key}" was already defined`)
            }
            mutations[key] = val
        },
    })

    const query = Object.keys(queries).length ? {
        query: new GraphQLObjectType({
            name: 'RootQuery',
            fields: queries,
        }),
    } : {}

    const mutation = Object.keys(mutations).length ? {
        mutation: new GraphQLObjectType({
            name: 'RootMutation',
            fields: mutations,
        }),
    } : {}

    const schema = {
        ...query,
        ...mutation,
    }

    // Let hack with the whole schema
    await createHook.serie(EXPRESS_GRAPHQL_HACK_SCHEMA, { schema })
    return new GraphQLSchema(schema)
}