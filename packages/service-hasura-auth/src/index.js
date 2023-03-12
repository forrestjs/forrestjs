const onInitService = require('./init-service');
const hasuraAuthPlugin = require('./hasura-auth.plugin');

const service = {
  name: 'hasura-auth',
  trace: __filename,
};

module.exports = ({ registerTargets }) => {
  registerTargets({
    HASURA_AUTH_GET: `${service.name}/get`,
    HASURA_AUTH_POST: `${service.name}/post`,
    HASURA_AUTH_FASTIFY: `${service.name}/fastify`,
  });

  return [
    {
      ...service,
      target: '$INIT_SERVICES',
      handler: onInitService,
    },
    {
      ...service,
      target: '$FASTIFY_PLUGIN?',
      handler: ({ registerPlugin }, { getContext, createExtension }) => {
        const options = getContext('hasuraAuth');
        registerPlugin(hasuraAuthPlugin, {
          ...options,
          createExtension,
        });
      },
    },
  ];
};
