const fastify = require('fastify');
const { INIT_SERVICE, START_SERVICE } = require('@forrestjs/hooks');
const hooks = require('./hooks');

class MissingPropertyError extends Error {}

// Receives in "route" the return data structure from a "registerHook.sync" call.
const makeRoute = method => route => {
  if (Array.isArray(route[0])) {
    return route[0].map(routeDef => ({
      ...routeDef,
      ...(method ? { method } : {}),
    }))
  }

  if (typeof route[0] === 'object') {
    return [{
      ...route[0],
      ...(method ? { method } : {}),
    }]
  }

  return null
}

const onInitService = ({ getConfig, setContext, createHook, getContext }) => {
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
    fastify: server
  });
  
  setContext('fastify', server);
};

const onStartService = ({ getContext, getConfig, createHook }) => {
  const server = getContext('fastify');

  // Register route utilities
  const registeredRoutes = []
  const registerRoute = (...options) => registeredRoutes.push(options);
  registerRoute.get = (url, handler) => registerRoute({ method: 'GET', url, handler });
  registerRoute.post = (url, handler) => registerRoute({ method: 'POST', url, handler });
  registerRoute.put = (url, handler) => registerRoute({ method: 'PUT', url, handler });
  registerRoute.delete = (url, handler) => registerRoute({ method: 'DELETE', url, handler });

  // Colle
  const collectedRoutes = [
    ...createHook.sync(hooks.FASTIFY_GET, { registerRoute: registerRoute.get, fastify: server }).map(makeRoute('GET')),
    ...createHook.sync(hooks.FASTIFY_POST, { registerRoute: registerRoute.post, fastify: server }).map(makeRoute('POST')),
    ...createHook.sync(hooks.FASTIFY_PUT, { registerRoute: registerRoute.put, fastify: server }).map(makeRoute('PUT')),
    ...createHook.sync(hooks.FASTIFY_DELETE, { registerRoute: registerRoute.delete, fastify: server }).map(makeRoute('DELETE')),
    ...createHook.sync(hooks.FASTIFY_ROUTE, { registerRoute, fastify: server }).map(makeRoute(null)),
  ]
  
  // Register the routes in the "after" hook as suggested by new docs:
  server.after(() => {
    // Register the routes collected out of the returning value of
    // the routing hooks
    collectedRoutes
      .filter($ => $ !== null)
      .filter($ => $[0] !== undefined)
      .reduce((acc, curr) => [...acc, ...curr], [])
      .forEach(route => {
        try {
          if (!route.hasOwnProperty('method')) throw new MissingPropertyError()
          if (!route.hasOwnProperty('url')) throw new MissingPropertyError()
          if (!route.hasOwnProperty('handler')) throw new MissingPropertyError()
          registerRoute(route)
        } catch (e) {
          // console.error(route, e)
        }
      })
    
    // Apply the registered routes to the running server
    registeredRoutes.forEach(route => {
      if (Array.isArray(route)) {
        route.forEach(server.route.bind(server))
      } else {
        server.route(...route)
      }
    })

    // Keep this hook for backward compatibility:
    createHook.sync(hooks.FASTIFY_HACKS_AFTER, { fastify: server });
  });


  const serverPort = getConfig('fastify.port', process.env.REACT_APP_PORT || process.env.PORT || 8080);
  const serverMeta = getConfig('fastify.meta', '::');
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
