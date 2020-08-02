const fastify = require('fastify');
const { INIT_SERVICE, START_SERVICE } = require('@forrestjs/hooks');
const hooks = require('./hooks');

const onInitService = ({ getConfig, setContext, createHook, getContext }) => {
  const options = getConfig('fastify.instance.options', {});
  const server = fastify(options);

  const registerPlugin = (...options) => server.register(...options);
  const registerRoute = (...options) => server.route(...options);

  // Method aliases
  registerRoute.get = (url, handler) => registerRoute({ method: 'GET', url, handler });
  registerRoute.post = (url, handler) => registerRoute({ method: 'POST', url, handler });
  registerRoute.put = (url, handler) => registerRoute({ method: 'PUT', url, handler });
  registerRoute.delete = (url, handler) => registerRoute({ method: 'DELETE', url, handler });

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
  });
  createHook.sync(hooks.FASTIFY_ROUTE, { registerRoute });

  setContext('fastify', server);
};

const onStartService = ({ getContext, getConfig, createHook }) => {
  const server = getContext('fastify');
  const serverPort = getConfig('fastify.port', process.env.REACT_APP_PORT || process.env.PORT || 8080);
  const serverMeta = getConfig('fastify.meta', '::');
  createHook.sync(hooks.FASTIFY_HACKS_AFTER, { fastify: server });
  server.listen(serverPort, serverMeta);
};

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);
  registerAction({
    hook: INIT_SERVICE,
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: onInitService,
  });
  registerAction({
    hook: START_SERVICE,
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: onStartService,
  });
};
