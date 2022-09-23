const { HasuraClient } = require('./hasura-client');

const hasuraClient = () => [
  {
    target: '$INIT_SERVICE',
    trace: __filename,
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
    target: '$FASTIFY_PLUGIN?',
    trace: __filename,
    handler: ({ decorateRequest }, { getContext }) => {
      const client = getContext('hasura.client');
      decorateRequest('hasura', client);
    },
  },
  {
    target: '$FETCHQ_DECORATE_CONTEXT?',
    trace: __filename,
    handler: (_, { getContext }) => {
      const hasura = getContext('hasura.client');
      return { hasura };
    },
  },
  {
    target: '$FASTIFY_TDD_ROUTE?',
    trace: __filename,
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

module.exports = hasuraClient;
