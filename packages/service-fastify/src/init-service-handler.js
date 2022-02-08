const fastify = require('fastify');
const axios = require('axios');
const actions = require('./actions');

module.exports = ({ getConfig, setContext, createExtension, getContext }) => {
  // Get overridable options from the app's context
  const { value: options } = createExtension.waterfall(
    actions.FASTIFY_OPTIONS,
    getConfig('fastify.instance.options', {}),
  );
  const server = fastify(options);

  // Register utilities to pass down to hooks:
  const registerPlugin = (...options) => server.register(...options);
  const decorate = (...options) => server.decorate(...options);

  // Add the references using hooks to comply with the decoratos API
  // https://www.fastify.io/docs/v3.15.x/Decorators/
  const decorateRequest = (name, value) => {
    server.decorateRequest(name, null);
    server.addHook('onRequest', (request, reply, done) => {
      request[name] = value;
      done();
    });
  };
  const decorateReply = (name, value) => {
    server.decorateReply(name, null);
    server.addHook('onResponse', (request, reply, done) => {
      reply[name] = value;
      done();
    });
  };

  // Decorate the Fastify App with the basic tools
  server.decorate('getConfig', getConfig);
  server.decorate('getContext', getContext);
  server.decorate('axios', axios);

  decorateRequest('getConfig', getConfig);
  decorateRequest('getContext', getContext);
  decorateRequest('axios', axios);

  decorateReply('getConfig', getConfig);
  decorateReply('getContext', getContext);
  decorateReply('axios', axios);

  createExtension.sync(actions.FASTIFY_HACKS_BEFORE, { fastify: server });
  createExtension.sync(actions.FASTIFY_PLUGIN, {
    registerPlugin,
    decorate,
    decorateRequest,
    decorateReply,
    fastify: server,
  });

  setContext('axios', axios);
  setContext('fastify', server);
};
