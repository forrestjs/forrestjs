const fastifyGql = require('./fastify-gql');

const service = {
  name: 'fastify-gql',
  trace: __filename,
};

const onFastifyPlugin = ({ registerPlugin }, ctx) => {
  const options = ctx.getConfig('fastify.gql', {});
  registerPlugin(fastifyGql(ctx), options);
};

module.exports = ({ registerTargets }) => {
  registerTargets({
    FASTIFY_GQL_EXTEND_SCHEMA: `${service.name}/extend-schema`,
    FASTIFY_GQL_EXTEND_CONTEXT: `${service.name}/extend-context`,
  });

  return [
    {
      ...service,
      target: '$INIT_SERVICE',
      handler: ({ log }) =>
        log.warn(
          'Package `service-fastify-gql` has been deprecated and will be removed from v6.x',
        ),
    },
    {
      ...service,
      target: '$FASTIFY_PLUGIN',
      handler: onFastifyPlugin,
    },
  ];
};
