const { INIT_SERVICE, START_SERVICE } = require('@forrestjs/core');
const targets = require('./targets');
const initServiceHandler = require('./init-service-handler');
const startServiceHandler = require('./start-service-handler');

const service = {
  name: 'fastify',
  trace: __filename,
};

module.exports = ({ registerTargets }) => {
  registerTargets(targets);

  return [
    {
      ...service,
      target: INIT_SERVICE,
      handler: initServiceHandler,
    },
    {
      ...service,
      target: START_SERVICE,
      handler: startServiceHandler,
    },

    // The TDD support is strictly scoped to the development
    // and test environment, even the module is conditionally
    // loaded to minimize the memory footprint in production
    ...(['development', 'test'].includes(process.env.NODE_ENV)
      ? [
          {
            ...service,
            target: '$FASTIFY_ROUTE',
            name: 'fastify-tdd',
            handler: require('./tdd-handler'),
          },
        ]
      : []),
  ];
};
