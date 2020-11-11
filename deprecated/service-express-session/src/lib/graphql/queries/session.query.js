import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { GraphQLID, GraphQLString } from 'graphql'
import * as hooks from '../../hooks'

export const sessionQuery = async ({
    attributeName,
    queryName,
    queryDesc,
    queries = {},
}, ctx) => {
    const args = {
        token: {
            type: GraphQLString,
        },
    }

    await ctx.createHook.serie(hooks.EXPRESS_SESSION_GRAPHQL_ARGS, {
        registerArg: (key, value) => (args[key] = value),
    })

    return {
        description: queryDesc,
        args,
        type: new GraphQLNonNull(new GraphQLObjectType({
            name: queryName,
            fields: {
                ...queries,
                id: {
                    type: GraphQLID,
                },
                jwt: {
                    type: GraphQLString,
                },
            },
        })),
        resolve: async (_, args, { req, res }) => {
            await req[attributeName].start(args.token)
            await ctx.createHook.serie(hooks.EXPRESS_SESSION_GRAPHQL_VALIDATE, {
                session: req[attributeName],
                args,
                req,
                res,
            })
            return req[attributeName]
        },
    }
}
