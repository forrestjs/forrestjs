import { GraphQLSchema, GraphQLObjectType } from 'graphql'
import expressGraphql from 'express-graphql'

// manifest of the available queries
const queries = {
    info: require('./info.query').default,
    users: require('./users.query').default,
    user: require('./user.query').default,
    todos: require('./todos.query').default,
    albums: require('./albums.query').default,
}

// manifest of the available mutation
// const mutations = {}

// package the GraphQL schema for the app
const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'RootQuery',
        fields: queries,
    }),
    // mutation: new GraphQLObjectType({
    //     name: 'RootMutation',
    //     fields: mutations,
    // }),
})

// ExpressJS middleware that mount GraphQL
export const graphQLHandler = (req, res) => expressGraphql({
    schema,
    graphiql: process.env.NODE_ENV === 'development',
    context: { req, res, data: {} },
})(req, res)
