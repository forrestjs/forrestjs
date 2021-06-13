const ApolloClient = require('apollo-boost').default;
require('cross-fetch/polyfill');

const { SERVICE_NAME, ...hooks } = require('./hooks');

module.exports = ({ registerAction, setContext, getConfig, registerHook }) => {
  registerHook(hooks);

  registerAction({
    hook: '$INIT_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    handler: () => {
      const apollo = new ApolloClient(getConfig('apollo.client.config', {}));
      setContext('apollo', apollo);
    },
  });

  registerAction({
    hook: '$FASTIFY_PLUGIN?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ decorate, decorateRequest }, { getContext }) => {
      const apollo = getContext('apollo');
      decorate('apollo', apollo);
      decorateRequest('apollo', apollo);
    },
  });
};
