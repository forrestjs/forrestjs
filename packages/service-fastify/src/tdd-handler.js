const {
  FASTIFY_TDD_ROUTE,
  FASTIFY_TDD_ROOT,
  FASTIFY_TDD_CHECK,
} = require('./hooks');

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

module.exports = ({ registerRoute }, { getConfig, setConfig, createHook }) => {
  const tddScope = getConfig('fastify.tdd.scope', '/test');
  const tddHealthz = getConfig('fastify.tdd.healthz', '/healthz');

  // Collect integrations from other services and features
  const routes = collectRoutes(createHook, tddScope);
  const healthzChecks = colleactHealthzChecks(createHook);
  const rootHandler = createHook.sync(FASTIFY_TDD_ROOT);

  // Root endpoint definition
  registerRoute({
    method: 'GET',
    url: tddScope,
    handler: rootHandler.length
      ? rootHandler[0][0]
      : async () => ({ success: true }),
  });

  // Healthz Endpoint - for testing
  // different apps can inject checkpoints to make this
  // endpoint available only after a specific moment
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
            value: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
              ],
            },
            default: { type: 'string' },
            isSet: { type: 'boolean' },
          },
          required: ['key', 'isSet'],
        },
      },
    },
    handler: async (request) => {
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

  // Let the test overwrite configuration vars
  registerRoute({
    method: 'POST',
    url: `${tddScope}/config`,
    schema: {
      body: {
        type: 'object',
        properties: {
          key: { type: 'string' },
          value: {
            type: ['string', 'number', 'boolean', 'null'],
          },
        },
        required: ['key', 'value'],
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            key: { type: 'string' },
            value: {
              oneOf: [
                { type: 'string' },
                { type: 'number' },
                { type: 'boolean' },
                { type: 'null' },
              ],
            },
          },
          required: ['key', 'value'],
        },
      },
    },
    handler: async (request) => {
      setConfig(request.body.key, request.body.value);
      return {
        ...request.body,
        value: getConfig(request.body.key),
      };
    },
  });

  // Register all the custom routes
  routes.map((routeDef) => registerRoute(routeDef));
};
