/**
 * This feature integrates with the test support that is offered by
 * the Fastify service.
 *
 * The test support is avaliable only when NODE_ENV is set to:
 * - development
 * - test
 *
 * It is possible to:
 * - inject custom test routes
 * - inject custom test healthz checks
 *
 */
module.exports = ({ registerAction }) => {
  /**
   * The test root should be used as Healthcheck for running the
   * tests. The checks are middlewars added as "preHandlers" to
   * such route.
   *
   * Services and features can add custom checks to verify that
   * the entire app is in order before starting to execute a test.
   *
   * Tests suites should use this endpoint as precondition to
   * be running the tests.
   */
  registerAction({
    hook: '$FASTIFY_TDD_CHECK',
    name: 'registerTddCheck',
    handler: ({ registerTddCheck }) => {
      // Simple void check
      registerTddCheck((request, reply, next) => next());

      // A check can decorate the request:
      registerTddCheck((request, reply, next) => {
        request.customData = 'custom response';
        next();
      });

      // A check can fail the route by checking specific conditions:
      registerTddCheck((request, reply, next) => {
        if (request.headers['foobar']) {
          reply.status(418).send('oops');
        }
        next();
      });
    },
  });

  /**
   * It is also possible to customize the test's root route
   * by providing a custom handler.
   *
   * In this example, we are sending out some data that was
   * decorated by the TDD Checks middlewares.
   *
   * NOTE: only the LAST REGISTERED HOOK will be used for
   *       this purpose.
   */
  registerAction({
    hook: '$FASTIFY_TDD_ROOT',
    name: 'registerTddRoute',
    handler: () => async (request) => request.customData,
  });

  /**
   * Services and Features can extend the TDD Api by providing
   * custom endpoints that will be added under the TDD Scope
   * route (defaults to: /test).
   *
   * NOTE: Only the explicit register function is provided.
   */
  registerAction({
    hook: '$FASTIFY_TDD_ROUTE',
    name: 'registerTddRoute',
    handler: ({ registerTddRoute }) => {
      registerTddRoute({
        method: 'GET',
        url: '/t1',
        handler: async () => 't1',
      });
    },
  });
};
