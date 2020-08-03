const { SERVICE_NAME, ...hooks } = require('./hooks');

const healthzRouteHandler = async () => ({
  success: true,
  message: '+ok',
  emotion: '💩',
});

module.exports = ({ registerAction, createHook, getConfig, registerHook }) => {
  registerHook(hooks);

  registerAction({
    hook: '$FASTIFY_ROUTE',
    name: SERVICE_NAME,
    handler: ({ registerRoute }) => {
      // Let a custom handler logic being injected
      let customHandler = null;
      const registerHandler = (handler) => (customHandler = handler);
      createHook.sync(hooks.FASTIFY_HEALTHZ_HANDLER, { registerHandler });

      // Setup the route
      registerRoute({
        method: getConfig('fastify.healthz.method', 'GET'),
        url: getConfig('fastify.healthz.url', '/healthz'),
        handler: customHandler || healthzRouteHandler,
      });
    },
  });
};
