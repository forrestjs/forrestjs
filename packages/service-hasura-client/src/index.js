const { HasuraClient } = require('./hasura-client');

const service = {
  ...service,
  name: 'hasura-client',
};

module.exports = () => [
  {
    ...service,
    target: '$INIT_SERVICE',
    priority: 200, // Must run before Fastify & Fetchq
    handler: ({ getConfig, setContext }) => {
      const endpoint = getConfig('hasura.endpoint');
      const secret = getConfig('hasura.secret', 'hasura');
      const token = getConfig('hasura.auth.token');
      const client = new HasuraClient(endpoint, {
        token,
        secret,
      });
      setContext('hasura.client', client);
      setContext('hasura.query', client.query.bind(client));
      setContext('hasura.sql', client.sql.bind(client));
    },
  },
  {
    ...service,
    target: '$FASTIFY_PLUGIN?',
    handler: ({ decorateRequest }, { getContext }) => {
      const client = getContext('hasura.client');
      decorateRequest('hasura', client);
    },
  },
  {
    ...service,
    target: '$FETCHQ_DECORATE_CONTEXT?',
    handler: (_, { getContext }) => {
      const hasura = getContext('hasura.client');
      return { hasura };
    },
  },
  {
    ...service,
    target: '$FASTIFY_TDD_ROUTE?',
    handler: ({ registerTddRoute }, { getContext }) => {
      const hasura = getContext('hasura');

      registerTddRoute({
        method: 'POST',
        url: '/hasura/query',
        handler: async (request, reply) => {
          const data = await hasura.query(
            request.body.query,
            request.body.variables,
          );
          reply.send({
            data,
          });
        },
      });

      registerTddRoute({
        method: 'POST',
        url: '/hasura/sql',
        handler: async (request, reply) => {
          const data = await hasura.sql(request.body.sql, request.body.source);
          reply.send({
            data,
          });
        },
      });
    },
  },
];
