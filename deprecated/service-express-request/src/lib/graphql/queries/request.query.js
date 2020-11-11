import { GraphQLObjectType, GraphQLNonNull } from 'graphql'
import { GraphQLID } from 'graphql'

// `attributeName` default value come from
// https://www.npmjs.com/package/express-request-id
// @TODO: let extensions enrich the selection of fields
export const requestQuery = ({ attributeName = 'id' }, ctx) => ({
    description: 'Provides the current request informations',
    type: new GraphQLNonNull(new GraphQLObjectType({
        name: 'RequestQuery',
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
