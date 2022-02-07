/**
 * This feature exposes some routes using the generic $FASTIFY_ROUTE hook.
 *
 * You gain access to the full "fastify.register()" API and you
 * must describe the entire set of minimal Fastify properties in
 * order to expose new routes.
 *
 * NOTE: You can register as many routes as you may want within a
 * single feature.
 */
module.exports = ({ registerExtension }) => {
  /**
   * Using the full `registerRoute` API
   */
  registerExtension({
    action: '$FASTIFY_ROUTE',
    name: 'registerRoute',
    handler: ({ registerRoute }) => {
      registerRoute({
        method: 'GET',
        url: '/',
        handler: async () => 'Home Page',
      });
      registerRoute({
        method: 'GET',
        url: '/page1',
        handler: async () => 'Page1',
      }); // Example with a schema validation applied to the route:

      registerRoute({
        method: 'GET',
        url: '/page2/:name',
        schema: {
          params: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                minLength: 1,
              },
            },
            required: ['name'],
          },
        },
        handler: async (request) => `Page2: ${request.params.name}`,
      });
    },
  });

  /**
   * Using the returning API
   * (single value)
   */
  registerExtension({
    action: '$FASTIFY_ROUTE',
    name: 'registerRoute_returningSingle',
    handler: () => ({
      method: 'GET',
      url: '/page3',
      handler: async () => 'Page3',
    }),
  });

  /**
   * Using the returning API
   * (with multiple declarations)
   */
  registerExtension({
    action: '$FASTIFY_ROUTE',
    name: 'registerRoute_returningMulti',
    handler: () => [
      {
        method: 'GET',
        url: '/page4',
        handler: async () => 'Page4',
      },
      {
        method: 'GET',
        url: '/page5',
        handler: async () => 'Page5',
      },
    ],
  });

  /**
   * Using the declarative API
   * (single value)
   */
  registerExtension({
    action: '$FASTIFY_ROUTE',
    name: 'registerRoute_declarativeSingle',
    handler: {
      method: 'GET',
      url: '/page6',
      handler: async () => 'Page6',
    },
  });

  /**
   * Using the declarative API
   * (multiple value)
   */
  registerExtension({
    action: '$FASTIFY_ROUTE',
    name: 'registerRoute_declarativeMulti',
    handler: [
      {
        method: 'GET',
        url: '/page7',
        handler: async () => 'Page7',
      },
      {
        method: 'GET',
        url: '/page8',
        handler: async () => 'Page8',
      },
    ],
  });
};
