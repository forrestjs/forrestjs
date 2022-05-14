const { INIT_SERVICE, START_SERVICE } = require('@forrestjs/core');
const targets = require('./targets');
const initServiceHandler = require('./init-service-handler');
const startServiceHandler = require('./start-service-handler');

const service = {
  name: 'fastify',
  trace: __filename,
};

module.exports = ({ registerExtension, registerTargets }) => {
  registerTargets(targets);

  // The TDD support is strictly scoped to the development
  // and test environment, even the module is conditionally
  // loaded to minimize the memory footprint in production
  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    const tddHandler = require('./tdd-handler');
    registerExtension({
      ...service,
      target: '$FASTIFY_ROUTE',
      name: 'fastify-tdd',
      handler: tddHandler,
    });
  }

  registerExtension({
    ...service,
    target: INIT_SERVICE,
    handler: initServiceHandler,
  });

  registerExtension({
    ...service,
    target: START_SERVICE,
    handler: startServiceHandler,
  });
};
