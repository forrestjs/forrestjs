/**
 * Extends the GraphQL service with a custom query
 * to monitor the uptime:
 */

const gql = require('graphql-tag');

const pingActionHandler = () => {
  const typeDefs = gql`
    type Ping {
      message: String
      emotion: String
    }

    extend type Query {
      ping: Ping!
    }
  `;

  const resolvers = {
    Query: {
      ping: () => ({
        message: '+ok',
        emotion: '💩',
      }),
    },
  };

  // registerSchema(typeDefs, resolvers);
  return { typeDefs, resolvers };
};

module.exports = ({ registerAction }) =>
  registerAction({
    hook: '$FASTIFY_GQL_EXTEND_SCHEMA',
    name: 'ping',
    handler: pingActionHandler,
  });
