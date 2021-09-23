import {
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from 'graphql'

import { fetchUserData } from '../jsonplaceholder'

export default {
    description: 'Provide a single user by ID',
    args: {
        id: {
            type: new GraphQLNonNull(GraphQLID),
        },
    },
    type: new GraphQLObjectType({
        name: 'User',
        fields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: new GraphQLNonNull(GraphQLString) },
            email: { type: new GraphQLNonNull(GraphQLString) },
            phone: { type: new GraphQLNonNull(GraphQLString) },
            website: { type: new GraphQLNonNull(GraphQLString) },
            company: {
                type: new GraphQLObjectType({
                    name: 'UserCompany',
                    fields: {
                        name: { type: new GraphQLNonNull(GraphQLString) },
                        catchPhrase: { type: new GraphQLNonNull(GraphQLString) },
                    },
                }),
            },
            address: {
                type: new GraphQLObjectType({
                    name: 'UserAddress',
                    fields: {
                        street: { type: new GraphQLNonNull(GraphQLString) },
                        suite: { type: new GraphQLNonNull(GraphQLString) },
                        city: { type: new GraphQLNonNull(GraphQLString) },
                        zipcode: { type: new GraphQLNonNull(GraphQLString) },
                    },
                }),
            },
        },
    }),
    resolve: (params, args) => fetchUserData(args.id),
}
