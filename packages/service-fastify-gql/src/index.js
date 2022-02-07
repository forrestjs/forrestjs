const fastifyGql = require('./fastify-gql');
const { SERVICE_NAME, ...targets } = require('./targets');

const onFastifyPlugin = ({ registerPlugin }, ctx) => {
  const options = ctx.getConfig('fastify.gql', {});
  registerPlugin(fastifyGql(ctx), options);
};

module.exports = ({ registerTargets, registerAction }) => {
  registerTargets(targets);

  registerAction({
    target: '$FASTIFY_PLUGIN',
    name: SERVICE_NAME,
    trace: __filename,
    handler: onFastifyPlugin,
  });
};
