import { GraphQLObjectType, GraphQLString } from 'graphql'

export const authQuery = async (queries = {}, config, ctx) => {
    // Inject a basic query on the user's ID
    if (!queries.id) {
        queries.id = {
            type: GraphQLString,
            resolve: $ => $.id,
        }
    }

    return {
        description: 'Wraps Auth dependent queries',
        type: new GraphQLObjectType({
            name: 'AuthQuery',
            fields: queries,
        }),
        resolve: (_, args, { req, res }) => req.auth.validate(),
    }
}
