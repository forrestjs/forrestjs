import { GraphQLObjectType } from 'graphql'

export const authMutation = async (mutations = {}, config, ctx) => ({
    description: 'Wraps Auth dependent mutations',
    type: new GraphQLObjectType({
        name: 'AuthMutation',
        fields: mutations,
    }),
    resolve: (_, args, { req, res }) => req.auth.validate(),
})
