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
    target: '$FASTIFY_GET',
    name: 'registerRouteGet',
    handler: ({ registerRoute }) => {
      registerRoute('/info1', async () => 'Info1');
      registerRoute('/info2', async () => 'Info2');
    },
  });
  /**
   * Using the returning API
   * (single value)
   */

  registerAction({
    target: '$FASTIFY_GET',
    name: 'registerRouteGet_returningSingle',
    handler: () => ({
      url: '/info3',
      handler: async () => 'Info3',
    }),
  });
  /**
   * Using the returning API
   * (multiple values)
   */

  registerAction({
    target: '$FASTIFY_GET',
    name: 'registerRouteGet_returningMulti',
    handler: () => [
      {
        url: '/info4',
        handler: async () => 'Info4',
      },
      {
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
    target: '$FASTIFY_GET',
    name: 'registerRouteGet_declarativeSingle',
    handler: {
      url: '/info6',
      handler: async () => 'Info6',
    },
  });
  /**
   * Using the declarative API
   * (multiple values)
   */

  registerAction({
    target: '$FASTIFY_GET',
    name: 'registerRouteGet_declarativeMulti',
    handler: [
      {
        url: '/info7',
        handler: async () => 'Info7',
      },
    ],
  });
};
