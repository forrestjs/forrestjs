const fastify = require('fastify');
const hooks = require('./hooks');

module.exports = ({ getConfig, setContext, createHook, getContext }) => {
  // Get overridable options from the app's context
  const { value: options } = createHook.waterfall(hooks.FASTIFY_OPTIONS, {
    options: getConfig('fastify.instance.options', {}),
  });
  const server = fastify(options);

  const registerPlugin = (...options) => server.register(...options);
  const decorate = (...options) => server.decorate(...options);
  const decorateRequest = (...options) => server.decorateRequest(...options);
  const decorateReply = (...options) => server.decorateReply(...options);

  server.decorate('getConfig', getConfig);
  server.decorate('getContext', getContext);

  // Prepare the shape of request/reply object
  server.decorateRequest('getConfig', null);
  server.decorateRequest('getContext', null);
  server.decorateReply('getConfig', null);
  server.decorateReply('getContext', null);

  // Inject references in each request object
  server.addHook('onRequest', (request, reply, done) => {
    request.getConfig = getConfig;
    request.getContext = getContext;
    done();
  });

  // Inject references in each reply object
  server.addHook('onResponse', (request, reply, done) => {
    request.getConfig = getConfig;
    request.getContext = getContext;
    done();
  });

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
