const fp = require('fastify-plugin');
const { ApolloServer } = require('apollo-server-fastify');
const { buildSubgraphSchema } = require('@apollo/federation');
const {
  FASTIFY_GQL_EXTEND_SCHEMA,
  FASTIFY_GQL_EXTEND_CONTEXT,
} = require('./targets');
const defaultSchema = require('./schema');

const fastifyGql = (forrestjs) => async (fastify, opts, next) => {
  const { createExtension } = forrestjs;

  // Collect schema extensions from other features/services
  const schemaExtensions = createExtension
    .sync(FASTIFY_GQL_EXTEND_SCHEMA)
    .map((ext) => ext[0]);

  // Create the full schema
  const schema = buildSubgraphSchema([
    defaultSchema.query,
    defaultSchema.mutation,
    ...schemaExtensions,
  ]);

  // Set the handlers' execution schema
  const context = (request) => {
    const params = {
      request,
      fastify,
    };

    // Collect context extensions from other features/services
    const contextExtensions = createExtension
      .sync(FASTIFY_GQL_EXTEND_CONTEXT, params)
      .reduce((acc, curr) => ({ ...acc, ...curr[0] }), {});

    return {
      ...contextExtensions,
      ...params,
      forrestjs,
    };
  };

  const server = new ApolloServer({
    schema,
    context,
    ...opts,
  });

  // Optionally start the server
  if (server.state.phase !== 'started') {
    await server.start();
  }

  // const handler = server.createHandler();
  fastify.register(server.createHandler());

  next();
};

module.exports = fp(fastifyGql);
