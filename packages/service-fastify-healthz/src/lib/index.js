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
      const handlers = createHook.sync(hooks.FASTIFY_HEALTHZ_HANDLER, { registerHandler });

      // Allows to return the route handler from the hooks' hander
      if (!customHandler && handlers.length && typeof handlers[0][0] === 'function') {
        customHandler = handlers[0][0]
      }

      // Setup the route
      registerRoute({
        method: getConfig('fastify.healthz.method', 'GET'),
        url: getConfig('fastify.healthz.url', '/healthz'),
        handler: customHandler || healthzRouteHandler,
      });
    },
  });
};
