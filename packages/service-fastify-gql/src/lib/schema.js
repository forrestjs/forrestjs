const { gql } = require('apollo-server-fastify');

module.exports = {
  query: {
    typeDefs: gql`
      type Query {
        _empty: String
      }
    `,
    resolvers: {},
  },
  mutation: {
    typeDefs: gql`
      type Mutation {
        _empty: String
      }
    `,
    resolvers: {},
  },
};
