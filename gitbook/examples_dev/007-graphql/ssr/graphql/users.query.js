import {
    GraphQLNonNull,
    GraphQLList,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from 'graphql'

import { fetchUsersList } from '../jsonplaceholder'

export default {
    description: 'Provides a list of users',
    type: new GraphQLNonNull(new GraphQLList(new GraphQLObjectType({
        name: 'UsersListItem',
        fields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            name: { type: new GraphQLNonNull(GraphQLString) },
        },
    }))),
    resolve: fetchUsersList,
}
