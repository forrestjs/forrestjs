const fastifyGql = require('./fastify-gql');
const { SERVICE_NAME, ...hooks } = require('./hooks');

const onFastifyPlugin = ({ registerPlugin }, ctx) => {
  const options = ctx.getConfig('fastify.gql', {});
  registerPlugin(fastifyGql(ctx), options);
};

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);

  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: SERVICE_NAME,
    trace: __filename,
    handler: onFastifyPlugin,
  });
};
