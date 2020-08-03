const { SERVICE_NAME, ...hooks } = require('./hooks');

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);
  registerAction({
    hook: '$FASTIFY_HACKS_AFTER',
    name: SERVICE_NAME,
    handler: (_, { getContext }) => {
      const fetchq = getContext('fetchq', null);
      const fastify = getContext('fastify', null);
      if (fastify && fetchq) {
        fastify.decorateRequest('fetchq', fetchq);
      }
    },
  });
};
