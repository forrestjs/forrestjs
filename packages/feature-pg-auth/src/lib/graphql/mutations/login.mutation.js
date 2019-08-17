import { GraphQLNonNull, GraphQLObjectType, GraphQLInt } from 'graphql'
import { GraphQLString, GraphQLID } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { GraphQLDateTime } from 'graphql-iso-date'
import { login } from '../../auth-account.lib'

export const loginMutation = () => ({
    description: 'Authenticates the current session',
    args: {
        uname: {
            type: new GraphQLNonNull(GraphQLString),
        },
        passw: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
    // type: GraphQLJSON,
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: 'AuthAccount',
        fields: {
            id: {
                type: new GraphQLNonNull(GraphQLID),
            },
            uname: {
                type: new GraphQLNonNull(GraphQLString),
            },
            status: {
                type: new GraphQLNonNull(GraphQLInt),
            },
            etag: {
                type: new GraphQLNonNull(GraphQLInt),
            },
            payload: {
                type: GraphQLJSON,
            },
            lastLogin: {
                type: GraphQLDateTime,
            },
            createdAt: {
                type: GraphQLDateTime,
            },
            token: {
                type: GraphQLString,
            },
        },
    })),
    resolve: async (_, args, { req, res }) => ({
        ...(await login(args, req, res)),
        token: req.session.jwt,
    }),
})
