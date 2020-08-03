const fp = require('fastify-plugin');
const { ApolloServer } = require('apollo-server-fastify');
const { buildFederatedSchema } = require('@apollo/federation');

const {
  FASTIFY_GQL_EXTEND_SCHEMA,
  FASTIFY_GQL_EXTEND_CONTEXT,
} = require('./hooks');
const defaultSchema = require('./schema');

const fastifyGql = hooks => (fastify, opts, next) => {
  const { createHook } = hooks;

  // Collect schema extensions from other features/services
  const schemaExtensions = createHook
    .sync(FASTIFY_GQL_EXTEND_SCHEMA)
    .map(ext => ext[0]);

  // Create the full schema
  const schema = buildFederatedSchema([
    defaultSchema.query,
    defaultSchema.mutation,
    ...schemaExtensions,
  ]);

  // Set the handlers' execution schema
  const context = request => {
    const params = {
      request,
      fastify,
    };

    // Collect context extensions from other features/services
    const contextExtensions = createHook
      .sync(FASTIFY_GQL_EXTEND_CONTEXT, params)
      .reduce((acc, curr) => ({ ...acc, ...curr[0] }), {});

    return {
      ...contextExtensions,
      ...params,
      hooks,
    };
  };

  const server = new ApolloServer({
    schema,
    context,
  });

  fastify.register(server.createHandler());

  next();
};

module.exports = fp(fastifyGql);
