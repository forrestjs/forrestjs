import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { GraphQLID } from 'graphql'

// @TODO: let extensions enrich the selection of fields
export const deviceQuery = ({ attributeName }, ctx) => ({
    description: 'Provides the current device informations',
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: 'DeviceQuery',
        fields: {
            id: {
                type: GraphQLID,
            },
        },
    })),
    resolve: (_, args, { req }) => ({
        id: req[attributeName],
    }),
})
