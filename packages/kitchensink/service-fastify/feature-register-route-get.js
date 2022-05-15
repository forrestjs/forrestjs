/**
 * This features uses the short hand hook "$FASTIFY_GET" that simplifies
 * (slightly) the declaration of basic routes.
 *
 * There are also the following similar hooks:
 * - $FASTIFY_POST
 * - $FASTIFY_PUT
 * - $FASTIFY_DELETE
 *
 */
module.exports = ({ registerAction }) => {
  /**
   * Using the `registerRoute` API with positional arguments
   */
  registerAction({
    target: '$FASTIFY_ROUTE',
    name: 'registerRouteGet',
    handler: ({ registerRoute }) => {
      registerRoute({
        method: 'GET',
        url: '/info1',
        handler: async () => 'Info1',
      });
      registerRoute({
        method: 'GET',
        url: '/info2',
        handler: async () => 'Info2',
      });
    },
  });
  /**
   * Using the returning API
   * (single value)
   */

  registerAction({
    target: '$FASTIFY_ROUTE',
    name: 'registerRouteGet_returningSingle',
    handler: () => ({
      method: 'GET',
      url: '/info3',
      handler: async () => 'Info3',
    }),
  });

  /**
   * Using the returning API
   * (multiple values)
   */

  registerAction({
    target: '$FASTIFY_ROUTE',
    name: 'registerRouteGet_returningMulti',
    handler: () => [
      {
        method: 'GET',
        url: '/info4',
        handler: async () => 'Info4',
      },
      {
        method: 'GET',
        url: '/info5',
        handler: async () => 'Info5',
      },
    ],
  });

  /**
   * Using the declarative API
   * (single value)
   */

  registerAction({
    target: '$FASTIFY_ROUTE',
    name: 'registerRouteGet_declarativeSingle',
    handler: {
      method: 'GET',
      url: '/info6',
      handler: async () => 'Info6',
    },
  });

  /**
   * Using the declarative API
   * (multiple values)
   */

  registerAction({
    target: '$FASTIFY_ROUTE',
    name: 'registerRouteGet_declarativeMulti',
    handler: [
      {
        method: 'GET',
        url: '/info7',
        handler: async () => 'Info7',
      },
    ],
  });
};
