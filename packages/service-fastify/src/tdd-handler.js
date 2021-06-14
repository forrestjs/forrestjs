const moxios = require('moxios');
const axios = require('axios');

const {
  FASTIFY_TDD_ROUTE,
  FASTIFY_TDD_ROOT,
  FASTIFY_TDD_CHECK,
  FASTIFY_TDD_RESET,
} = require('./hooks');

const healthzCheckTypeErrorMessage =
  '[fastify/tdd] The healthz check must be a Fastify compatible preHandler function';

const resetHandlerTypeErrorMessage =
  '[fastify/tdd] Reset handlers must be function';

const collectRoutes = (createHook, tddScope) => {
  const routes = [];

  const registerTddRoute = (routeDef = {}) =>
    routes.push({
      ...routeDef,
      url: `${tddScope}${routeDef.url}`,
    });

  // Also collects definition in the form of hook's results
  // Integrations can return either a single route definition
  // or a list of routes.
  createHook.sync(FASTIFY_TDD_ROUTE, { registerTddRoute }).map((result) => {
    // Skip null or undefined returns from hooks
    if (!result[0]) {
      return;
    }

    // Handle return in array form
    if (Array.isArray(result[0])) {
      result[0].map(registerTddRoute);
    }

    // Handle return in object form
    else {
      registerTddRoute(result[0]);
    }
  });

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

  return checksList;
};

const collectResetHandlers = (createHook) => {
  const handlers = [];
  const registerResetHandler = (handler, name = null) => {
    // Validate the input to the register handler function
    if (typeof handler !== 'function') {
      throw new Error(resetHandlerTypeErrorMessage);
    }

    handlers.push({
      name: name || handler.name,
      fn: handler,
    });
  };

  createHook
    .sync(FASTIFY_TDD_RESET, { registerResetHandler })
    .map((result) => result[0])
    .filter((check) => check !== undefined) // skip empty values
    .forEach(registerResetHandler);

  return handlers;
};

module.exports = ({ registerRoute }, { getConfig, setConfig, createHook }) => {
  const tddScope = getConfig('fastify.tdd.scope', '/test');

  // Collect integrations from other services and features
  const routes = collectRoutes(createHook, tddScope);
  const rootChecks = collectChecks(createHook);
  const rootHandler = createHook.sync(FASTIFY_TDD_ROOT);
  const resetHandlers = collectResetHandlers(createHook);

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
  // GET://test/config
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
  // POST://test/config
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

  // Let the test handle a full state reset for the app
  // GET://reset
  registerRoute({
    method: 'GET',
    url: `${tddScope}/reset`,
    handler: async (request, reply) => {
      console.log('RESET ROUTE');
      const results = [];

      for (const handler of resetHandlers) {
        const result = await handler.fn();
        results.push({
          name: handler.name,
          result,
        });
      }

      reply.send({
        success: true,
        data: { results },
      });
    },
  });

  registerRoute({
    method: 'POST',
    url: `${tddScope}/axios/stubs`,
    schema: {
      body: {
        type: 'object',
        properties: {
          url: { type: 'string' },
          method: {
            type: 'string',
            enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
          },
          response: {
            type: 'object',
            additionalProperties: true,
          },
        },
        required: ['url', 'response'],
      },
      response: {
        '2xx': {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      url: { type: 'string' },
                      response: {
                        type: 'object',
                        additionalProperties: true,
                      },
                    },
                    required: ['url', 'response'],
                  },
                },
              },
              required: ['items'],
            },
          },
          required: ['success', 'data'],
        },
        '4xx': {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      url: { type: 'string' },
                      response: {
                        type: 'object',
                        additionalProperties: true,
                      },
                    },
                    required: ['url', 'response'],
                  },
                },
              },
              required: ['items'],
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
                required: ['message'],
                additionalProperties: true,
              },
            },
          },
          required: ['success', 'errors', 'data'],
        },
      },
    },
    handler: (request, reply) => {
      if (moxios.stubs.__items.length === 0) {
        moxios.install();
      }

      const { method, url, response } = request.body;

      // Prevent from declaring the same stub twice
      const checkItem = moxios.stubs.__items.find((item) => item.url === url);
      if (checkItem) {
        return reply.status(400).send({
          success: false,
          errors: [{ message: 'Stub already exists' }],
          data: {
            items: moxios.stubs.__items,
          },
        });
      }

      // Provide the optional method to match a specific stub
      if (method) {
        moxios.stubRequest(method, url, response);
      } else {
        moxios.stubRequest(url, response);
      }

      reply.send({
        success: true,
        data: {
          items: moxios.stubs.__items,
        },
      });
    },
  });

  registerRoute({
    method: 'DELETE',
    url: `${tddScope}/axios/stubs`,
    schema: {
      response: {
        '2xx': {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              properties: {
                didReset: { type: 'boolean' },
              },
              required: ['didReset'],
            },
          },
          required: ['success', 'data'],
        },
        '4xx': {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            data: {
              type: 'object',
              additionalProperties: true,
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  message: { type: 'string' },
                },
                required: ['message'],
                additionalProperties: true,
              },
            },
          },
          required: ['success', 'data'],
        },
      },
    },
    handler: (request, reply) => {
      if (moxios.stubs.__items.length !== 0) {
        moxios.uninstall();
        reply.send({
          success: true,
          data: { didReset: true },
        });
      } else {
        reply.send({
          success: true,
          data: { didReset: false },
        });
      }
    },
  });

  // Register all the custom routes
  routes.map((routeDef) => registerRoute(routeDef));
};
