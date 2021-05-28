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
    hook: '$FASTIFY_HACKS_BEFORE?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ fastify }, { getContext }) => {
      const apollo = getContext('apollo', null);

      // Prepare the shape of the decorators
      fastify.decorate('apollo', apollo);
      fastify.decorateRequest('apollo', null);
      fastify.decorateReply('apollo', null);

      // Add the references using hooks to comply with the decoratos API
      // https://www.fastify.io/docs/v3.15.x/Decorators/

      fastify.addHook('onRequest', (request, reply, done) => {
        request.apollo = apollo;
        done();
      });

      fastify.addHook('onResponse', (request, reply, done) => {
        reply.apollo = apollo;
        done();
      });
    },
  });
};
