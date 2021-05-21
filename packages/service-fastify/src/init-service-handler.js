const fastify = require('fastify');
const hooks = require('./hooks');

module.exports = ({ getConfig, setContext, createHook, getContext }) => {
  const options = getConfig('fastify.instance.options', {});
  const server = fastify(options);

  const registerPlugin = (...options) => server.register(...options);

  const decorate = (...options) => server.decorate(...options);
  const decorateRequest = (...options) => server.decorateRequest(...options);
  const decorateReply = (...options) => server.decorateReply(...options);

  server.decorate('getConfig', getConfig);
  server.decorate('getContext', getContext);

  server.decorateRequest('getConfig', getConfig);
  server.decorateRequest('getContext', getContext);

  server.decorateReply('getConfig', getConfig);
  server.decorateReply('getContext', getContext);

  createHook.sync(hooks.FASTIFY_HACKS_BEFORE, { fastify: server });
  createHook.sync(hooks.FASTIFY_PLUGIN, {
    registerPlugin,
    decorate,
    decorateRequest,
    decorateReply,
    fastify: server,
  });

  setContext('fastify', server);
};
