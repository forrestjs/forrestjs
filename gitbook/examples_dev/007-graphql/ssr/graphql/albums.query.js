import {
    GraphQLNonNull,
    GraphQLList,
    GraphQLObjectType,
    GraphQLID,
    GraphQLString,
} from 'graphql'

import { fetchUserAlbums } from '../jsonplaceholder'

export default {
    description: 'Provide a list of albums, can be filtered by user',
    args: {
        userId: {
            type: GraphQLID,
        },
    },
    type: new GraphQLNonNull(new GraphQLList(new GraphQLObjectType({
        name: 'AlbumItem',
        fields: {
            id: { type: new GraphQLNonNull(GraphQLID) },
            userId: { type: new GraphQLNonNull(GraphQLID) },
            title: { type: new GraphQLNonNull(GraphQLString) },
        },
    }))),
    resolve: (params, args) => fetchUserAlbums(args.userId),
}
