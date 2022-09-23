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
      target: '$FASTIFY_PLUGIN',
      handler: onFastifyPlugin,
    },
  ];
};
