const ApolloClient = require('apollo-boost').default;
require('cross-fetch/polyfill');

const { SERVICE_NAME, ...targets } = require('./targets');

module.exports = ({
  registerAction,
  setContext,
  getConfig,
  registerTargets,
}) => {
  registerTargets(targets);

  registerAction({
    target: '$INIT_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    priority: 100,
    handler: () => {
      const apollo = new ApolloClient(getConfig('apollo.client.config', {}));
      setContext('apollo', apollo);
    },
  });

  registerAction({
    target: '$FASTIFY_PLUGIN?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ decorate, decorateRequest }, { getContext }) => {
      const apollo = getContext('apollo');
      decorate('apollo', apollo);
      decorateRequest('apollo', apollo);
    },
  });
};
