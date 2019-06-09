const { EXPRESS_GRAPHQL } = require('@forrestjs/service-express-graphql')
const { GraphQLList, GraphQLString } = require('graphql')

const resolve = (_, args, req) =>
    [
        `Welcome, ${args.name}!`,
        req.protocol + '://' + req.get('host') + req.originalUrl,
    ]

const welcomeQuery = ({ queries }) => 
    queries.welcome = {
        description: 'Welcome the user',
        args: {
            name: {
                type: GraphQLString,
                defaultValue: 'user',
            },
        },
        type: new GraphQLList(GraphQLString),
        resolve,
    }

module.exports = [ EXPRESS_GRAPHQL, welcomeQuery ]
