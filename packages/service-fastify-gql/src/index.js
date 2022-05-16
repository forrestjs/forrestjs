const fastifyGql = require('./fastify-gql');
const { SERVICE_NAME, ...targets } = require('./targets');

const onFastifyPlugin = ({ registerPlugin }, ctx) => {
  const options = ctx.getConfig('fastify.gql', {});
  registerPlugin(fastifyGql(ctx), options);
};

module.exports = ({ registerTargets }) => {
  registerTargets(targets);

  return [
    {
      target: '$FASTIFY_PLUGIN',
      trace: __filename,
      name: SERVICE_NAME,
      handler: onFastifyPlugin,
    },
  ];
};
