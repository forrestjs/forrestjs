const ApolloClient = require('apollo-boost').default;
require('cross-fetch/polyfill');

const service = {
  name: 'apollo',
  trace: __filename,
};

module.exports = ({ setContext, getConfig }) => [
  {
    ...service,
    priority: 100,
    target: '$INIT_SERVICE',
    handler: () => {
      const apollo = new ApolloClient(getConfig('apollo.client.config', {}));
      setContext('apollo', apollo);
    },
  },
  {
    ...service,
    target: '$FASTIFY_PLUGIN?',
    handler: ({ decorate, decorateRequest }, { getContext }) => {
      const apollo = getContext('apollo');
      decorate('apollo', apollo);
      decorateRequest('apollo', apollo);
    },
  },
];
