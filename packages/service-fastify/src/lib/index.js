const fastify = require('fastify');
const { INIT_SERVICE, START_SERVICE } = require('@forrestjs/hooks');
const hooks = require('./hooks');

class MissingPropertyError extends Error {}

// Receives in "route" the return data structure from a "registerHook.sync" call.
const makeRoute = method => route => {
  if (Array.isArray(route[0])) {
    return [{
      method,
      url: route[0][0],
      handler: route[0][1],
    }]
  }

  if (typeof route[0] === 'object') {
    return [{
      ...route[0],
      method,
    }]
  }

  return [null, null]
}

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

  // Register routes with generic and specialized handlers
  const routes = [
    ...createHook.sync(hooks.FASTIFY_GET, { registerRoute: registerRoute.get }).map(makeRoute('GET')),
    ...createHook.sync(hooks.FASTIFY_POST, { registerRoute: registerRoute.post }).map(makeRoute('POST')),
    ...createHook.sync(hooks.FASTIFY_PUT, { registerRoute: registerRoute.put }).map(makeRoute('PUT')),
    ...createHook.sync(hooks.FASTIFY_DELETE, { registerRoute: registerRoute.delete }).map(makeRoute('DELETE')),
    ...createHook.sync(hooks.FASTIFY_ROUTE, { registerRoute }),
  ]

  // Let register a feature with the return value:
  server.after(() => routes.forEach(route => {
    try {
      if (!route[0].hasOwnProperty('method')) throw new MissingPropertyError()
      if (!route[0].hasOwnProperty('url')) throw new MissingPropertyError()
      if (!route[0].hasOwnProperty('handler')) throw new MissingPropertyError()
      registerRoute(route[0])
    } catch (e) {
      // console.error(route[0], e)
    }
  }))
  
  createHook.sync(hooks.FASTIFY_HACKS_AFTER, { fastify: server });
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
