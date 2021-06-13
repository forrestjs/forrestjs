const { INIT_SERVICE, START_SERVICE } = require('@forrestjs/hooks');
const hooks = require('./hooks');
const initServiceHandler = require('./init-service-handler');
const startServiceHandler = require('./start-service-handler');

const service = {
  name: 'fastify',
  trace: __filename,
};

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);

  // The TDD support is strictly scoped to the development
  // and test environment, even the module is conditionally
  // loaded to minimize the memory footprint in production
  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    const tddHandler = require('./tdd-handler');
    registerAction({
      ...service,
      hook: '$FASTIFY_ROUTE',
      name: 'fastify-tdd',
      handler: tddHandler,
    });
  }

  registerAction({
    ...service,
    hook: INIT_SERVICE,
    handler: initServiceHandler,
  });

  registerAction({
    ...service,
    hook: START_SERVICE,
    handler: startServiceHandler,
  });
};
