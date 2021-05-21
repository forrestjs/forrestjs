const { FASTIFY_TDD_ROUTE, FASTIFY_TDD_CHECK } = require('./hooks');

const collectRoutes = (createHook, tddScope) => {
  const routes = [];
  const registerTddRoute = (routeDef = {}) =>
    routes.push({
      ...routeDef,
      url: `${tddScope}${routeDef.url}`,
    });
  createHook.sync(FASTIFY_TDD_ROUTE, { registerTddRoute });
  return routes;
};

const colleactHealthzChecks = (createHook) => {
  const promises = [];
  const registerTddCheck = (promise) => promises.push(promise);
  createHook.sync(FASTIFY_TDD_CHECK, { registerTddCheck });
  return promises.map(($) => (typeof $ === 'function' ? $() : $));
};

module.exports = ({ registerRoute }, { getConfig, createHook }) => {
  const tddScope = getConfig('fastify.tdd.scope', '/test');
  const tddHealthz = getConfig('fastify.tdd.healthz', '/healthz');

  // Collect integrations from other services and features
  const routes = collectRoutes(createHook, tddScope);
  const healthzChecks = colleactHealthzChecks(createHook);

  // Root endpoint definition
  registerRoute({
    method: 'GET',
    url: tddScope,
    handler: async () => ({ success: true }),
  });

  // Healthz endpoint
  registerRoute({
    method: 'GET',
    url: `${tddScope}${tddHealthz}`,
    handler: async () => Promise.all(healthzChecks),
  });

  // Let the test access configuration vars
  registerRoute({
    method: 'GET',
    url: `${tddScope}/config`,
    schema: {
      query: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          default: { type: 'string' },
        },
        required: ['key'],
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            key: { type: 'string' },
            value: { type: 'string' },
            default: { type: 'string' },
            isSet: { type: 'boolean' },
          },
          required: ['key', 'isSet'],
        },
      },
    },
    handler: async (request) => {
      console.log(request.query);
      try {
        return {
          ...request.query,
          value: getConfig(request.query.key),
          isSet: true,
        };
      } catch (err) {
        return {
          ...request.query,
          value: request.query.default
            ? getConfig(request.query.key, request.query.default)
            : undefined,
          isSet: false,
        };
      }
    },
  });

  // Register all the custom routes
  routes.map((routeDef) => registerRoute(routeDef));
};
