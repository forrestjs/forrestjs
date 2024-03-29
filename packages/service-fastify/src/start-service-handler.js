const { MissingPropertyError } = require('./errors');

// Receives in "route" the return data structure from a "registerHook.sync" call.
const makeRoute = (method) => (route) => {
  // if (method !== null) {
  //   console.warn(
  //     `[DEPRECATED] The extension "$FASTIFY_${method}" is deprecated and will be removed in v5.0.0. Use "$FASTIFY_ROUTE" instead.`,
  //   );
  // }

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

module.exports = ({ getContext, getConfig, createExtension, log }) => {
  const server = getContext('fastify');

  // Register route utilities
  const registeredRoutes = [];
  const registerRoute = (...options) => registeredRoutes.push(options);

  // DEPRECATE: must remove all the GET/POST/DELETE in v5.0.0
  const collectedRoutes = createExtension
    .sync('$FASTIFY_ROUTE', { registerRoute, fastify: server })
    .map(makeRoute(null));

  // Register the routes in the "after" hook as suggested by new docs:
  server.after(() => {
    // Register the routes collected out of the returning value of
    // the routing targets
    collectedRoutes
      .filter(($) => $ !== null)
      .filter(($) => $[0] !== undefined)
      .reduce((acc, curr) => [...acc, ...curr], [])
      .forEach((route) => {
        if (!route.hasOwnProperty('method')) throw new MissingPropertyError();
        if (!route.hasOwnProperty('url')) throw new MissingPropertyError();
        if (!route.hasOwnProperty('handler')) throw new MissingPropertyError();
        registerRoute(route);
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
    createExtension.sync('$FASTIFY_HACKS_AFTER', { fastify: server });
  });

  const serverPort = getConfig(
    'fastify.port',
    process.env.FASTIFY_PORT || process.env.PORT || 8080,
  );

  // const serverHost = getConfig(
  //   'fastify.host',
  //   process.env.FASTIFY_HOST || process.env.HOST || '::',
  // );

  // const serverConfig = getConfig('fastify.listen.config', {
  //   port: serverPort,
  //   host: serverHost,
  // });

  // const serverCallback = getConfig('fastify.listen.callback', (err) => {
  //   if (err) {
  //     log.error(`Fastify failed to start: ${err.message}`);
  //     throw err;
  //   }
  // });

  // if (process.env.NODE_ENV === 'production' && serverConfig.host === '::') {
  //   log.warn(`Fastify runs in production with host = ::`);
  // }

  // // const serverMeta = getConfig('fastify.meta', '::');
  // server.listen(serverConfig, serverCallback);

  const serverMeta = getConfig('fastify.meta', '::');
  server.listen({ port: serverPort }, serverMeta);
};
