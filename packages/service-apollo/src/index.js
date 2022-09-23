const ApolloClient = require('apollo-boost').default;
require('cross-fetch/polyfill');

const SERVICE_NAME = `apollo`;

module.exports = ({ setContext, getConfig }) => [
  {
    name: SERVICE_NAME,
    trace: __filename,
    priority: 100,
    target: '$INIT_SERVICE',
    handler: () => {
      const apollo = new ApolloClient(getConfig('apollo.client.config', {}));
      setContext('apollo', apollo);
    },
  },
  {
    name: SERVICE_NAME,
    trace: __filename,
    target: '$FASTIFY_PLUGIN?',
    handler: ({ decorate, decorateRequest }, { getContext }) => {
      const apollo = getContext('apollo');
      decorate('apollo', apollo);
      decorateRequest('apollo', apollo);
    },
  },
];
