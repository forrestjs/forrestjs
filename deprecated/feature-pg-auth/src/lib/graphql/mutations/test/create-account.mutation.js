import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql'
import GraphQLJSON from 'graphql-type-json'
import { create } from '../../../auth-account.lib'

export const testCreateAccountMutation = () => ({
    description: 'Creates a brand new Auth account',
    args: {
        uname: {
            type: new GraphQLNonNull(GraphQLString),
        },
        passw: {
            type: GraphQLString,
        },
        status: {
            type: GraphQLInt,
        },
        payload: {
            type: GraphQLJSON,
        },
    },
    type: GraphQLJSON,
    resolve: (params, args, { req, res }) => create({ ...args }, req, res),
})
