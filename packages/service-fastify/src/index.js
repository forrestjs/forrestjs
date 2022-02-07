const { INIT_SERVICE, START_SERVICE } = require('@forrestjs/hooks');
const actions = require('./actions');
const initServiceHandler = require('./init-service-handler');
const startServiceHandler = require('./start-service-handler');

const service = {
  name: 'fastify',
  trace: __filename,
};

module.exports = ({ registerExtension, registerActions }) => {
  registerActions(actions);

  // The TDD support is strictly scoped to the development
  // and test environment, even the module is conditionally
  // loaded to minimize the memory footprint in production
  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    const tddHandler = require('./tdd-handler');
    registerExtension({
      ...service,
      action: '$FASTIFY_ROUTE',
      name: 'fastify-tdd',
      handler: tddHandler,
    });
  }

  registerExtension({
    ...service,
    action: INIT_SERVICE,
    handler: initServiceHandler,
  });

  registerExtension({
    ...service,
    action: START_SERVICE,
    handler: startServiceHandler,
  });
};
