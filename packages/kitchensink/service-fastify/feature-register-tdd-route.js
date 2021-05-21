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
  registerAction({
    hook: '$FASTIFY_TDD_ROOT',
    name: 'registerTddRoute',
    handler: () => async () => 'custom response',
  });

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

  registerAction({
    hook: '$FASTIFY_TDD_CHECK',
    name: 'registerTddCheck',
    handler: ({ registerTddCheck }) => {
      // Just register a promise
      registerTddCheck(
        new Promise((resolve) => {
          setTimeout(() => resolve('check1'));
        }),
      );

      // Register a function that returns a promise
      registerTddCheck(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve('check2'));
          }),
      );

      // Or just an asynchronous function
      registerTddCheck(async () => 'check3');
    },
  });
};
