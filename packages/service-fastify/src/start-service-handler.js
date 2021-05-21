const hooks = require('./hooks');
const { MissingPropertyError } = require('./errors');

// Receives in "route" the return data structure from a "registerHook.sync" call.
const makeRoute = (method) => (route) => {
  if (Array.isArray(route[0])) {
    return route[0].map((routeDef) => ({
      ...routeDef,
      ...(method ? { method } : {}),
    }));
  }

  if (typeof route[0] === 'object') {
    return [
      {
        ...route[0],
        ...(method ? { method } : {}),
      },
    ];
  }

  return null;
};

module.exports = ({ getContext, getConfig, createHook }) => {
  const server = getContext('fastify');

  // Register route utilities
  const registeredRoutes = [];
  const registerRoute = (...options) => registeredRoutes.push(options);
  registerRoute.get = (url, handler) =>
    registerRoute({ method: 'GET', url, handler });
  registerRoute.post = (url, handler) =>
    registerRoute({ method: 'POST', url, handler });
  registerRoute.put = (url, handler) =>
    registerRoute({ method: 'PUT', url, handler });
  registerRoute.delete = (url, handler) =>
    registerRoute({ method: 'DELETE', url, handler });

  // Colle
  const collectedRoutes = [
    ...createHook
      .sync(hooks.FASTIFY_GET, {
        registerRoute: registerRoute.get,
        fastify: server,
      })
      .map(makeRoute('GET')),
    ...createHook
      .sync(hooks.FASTIFY_POST, {
        registerRoute: registerRoute.post,
        fastify: server,
      })
      .map(makeRoute('POST')),
    ...createHook
      .sync(hooks.FASTIFY_PUT, {
        registerRoute: registerRoute.put,
        fastify: server,
      })
      .map(makeRoute('PUT')),
    ...createHook
      .sync(hooks.FASTIFY_DELETE, {
        registerRoute: registerRoute.delete,
        fastify: server,
      })
      .map(makeRoute('DELETE')),
    ...createHook
      .sync(hooks.FASTIFY_ROUTE, { registerRoute, fastify: server })
      .map(makeRoute(null)),
  ];

  // Register the routes in the "after" hook as suggested by new docs:
  server.after(() => {
    // Register the routes collected out of the returning value of
    // the routing hooks
    collectedRoutes
      .filter(($) => $ !== null)
      .filter(($) => $[0] !== undefined)
      .reduce((acc, curr) => [...acc, ...curr], [])
      .forEach((route) => {
        try {
          if (!route.hasOwnProperty('method')) throw new MissingPropertyError();
          if (!route.hasOwnProperty('url')) throw new MissingPropertyError();
          if (!route.hasOwnProperty('handler'))
            throw new MissingPropertyError();
          registerRoute(route);
        } catch (e) {
          // console.error(route, e)
        }
      });

    // Apply the registered routes to the running server
    registeredRoutes.forEach((route) => {
      if (Array.isArray(route)) {
        route.forEach(server.route.bind(server));
      } else {
        server.route(...route);
      }
    });

    // Keep this hook for backward compatibility:
    createHook.sync(hooks.FASTIFY_HACKS_AFTER, { fastify: server });
  });

  const serverPort = getConfig(
    'fastify.port',
    process.env.REACT_APP_PORT || process.env.PORT || 8080,
  );
  const serverMeta = getConfig('fastify.meta', '::');
  server.listen(serverPort, serverMeta);
};
