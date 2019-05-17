import {
    GraphQLNonNull,
    GraphQLList,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
    GraphQLBoolean,
} from 'graphql'

import { fetchUserTodos } from '../jsonplaceholder'

export default {
    description: 'Provide a list of todos, can be filtered by user',
    args: {
        userId: {
            type: GraphQLID,
        },
    },
    type: new GraphQLNonNull(new GraphQLList(new GraphQLObjectType({
        name: 'TodoItem',
        fields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            userId: { type: new GraphQLNonNull(GraphQLID) },
            title: { type: new GraphQLNonNull(GraphQLString) },
            completed: { type: new GraphQLNonNull(GraphQLBoolean) },
        },
    }))),
    resolve: (params, args) => fetchUserTodos(args.userId),
}
