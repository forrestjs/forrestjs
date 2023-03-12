const service = {
  name: 'fastify-healthz',
  trace: __filename,
};

const healthzCheckTypeErrorMessage =
  '[fastify-healthz] The healthz check must be a Fastify compatible preHandler function';

const healthzRouteHandler = async () => ({
  success: true,
  message: '+ok',
  emotion: '💩',
});

module.exports = ({ registerTargets }) => {
  registerTargets({
    FASTIFY_HEALTHZ_HANDLER: `${service.name}/hanlder`,
    FASTIFY_HEALTHZ_CHECK: `${service.name}/check`,
  });

  return [
    {
      ...service,
      target: '$FASTIFY_ROUTE',
      handler: ({ registerRoute }, { createExtension, getConfig }) => {
        // Let a custom handler logic being injected
        let customHandler = null;
        const registerHandler = (handler) => (customHandler = handler);
        const returnedHandlers = createExtension.sync(
          '$FASTIFY_HEALTHZ_HANDLER',
          {
            registerHandler,
          },
        );

        // Allows to return the route handler from the targets' hander
        if (!customHandler && returnedHandlers.length) {
          const lastReturnedHandler =
            returnedHandlers[returnedHandlers.length - 1][0];
          if (typeof lastReturnedHandler === 'function') {
            customHandler = lastReturnedHandler;
          } else {
            console.error('Invalid healthz handler', {
              service: 'fastify-healthz',
            });
          }
        }

        // Collect healthz checks that will delay the route
        // until it will be ready
        const checkList = [];
        const registerHealthzCheck = (check) => {
          if (typeof check !== 'function') {
            throw new Error(healthzCheckTypeErrorMessage);
          }
          checkList.push(check);
        };
        createExtension
          .sync('$FASTIFY_HEALTHZ_CHECK', {
            registerHealthzCheck,
          })
          .forEach((result) => registerHealthzCheck(result[0]));

        // Setup the route
        registerRoute({
          method: getConfig('fastify.healthz.method', 'GET'),
          url: getConfig('fastify.healthz.url', '/healthz'),
          handler: customHandler || healthzRouteHandler,
          preHandler: checkList,
        });
      },
    },
  ];
};
