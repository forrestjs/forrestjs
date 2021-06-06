const {
  FASTIFY_TDD_ROUTE,
  FASTIFY_TDD_ROOT,
  FASTIFY_TDD_CHECK,
} = require('./hooks');

const healthzCheckTypeErrorMessage =
  '[fastify/tdd] The healthz check must be a Fastify compatible preHandler function';

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

const collectChecks = (createHook) => {
  const checksList = [];
  const registerTddCheck = (check) => {
    // Validate the input to the register check function
    if (typeof check !== 'function') {
      throw new Error(healthzCheckTypeErrorMessage);
    }

    checksList.push(check);
  };
  createHook
    .sync(FASTIFY_TDD_CHECK, { registerTddCheck })
    .map((result) => result[0])
    .filter((check) => check !== undefined) // skip empty values
    .forEach(registerTddCheck);

  // Filter out functions only
  return checksList;
};

module.exports = ({ registerRoute }, { getConfig, setConfig, createHook }) => {
  const tddScope = getConfig('fastify.tdd.scope', '/test');

  // Collect integrations from other services and features
  const routes = collectRoutes(createHook, tddScope);
  const rootChecks = collectChecks(createHook);
  const rootHandler = createHook.sync(FASTIFY_TDD_ROOT);

  // Root endpoint definition
  registerRoute({
    method: 'GET',
    url: tddScope,
    preHandler: rootChecks,
    handler: rootHandler.length
      ? rootHandler[rootHandler.length - 1][0]
      : async () => '+ok',
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
                { type: 'object', additionalProperties: true },
                { type: 'array' },
              ],
              // type: 'object',
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
