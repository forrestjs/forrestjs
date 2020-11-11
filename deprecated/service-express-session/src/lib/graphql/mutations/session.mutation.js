import { GraphQLObjectType, GraphQLNonNull, GraphQLString } from 'graphql'
import * as hooks from '../../hooks'

export const sessionMutation = async ({
    attributeName,
    mutationName,
    mutationDesc,
    mutations = {},
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
        description: mutationDesc,
        args,
        type: new GraphQLNonNull(new GraphQLObjectType({
            name: mutationName,
            fields: mutations,
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
