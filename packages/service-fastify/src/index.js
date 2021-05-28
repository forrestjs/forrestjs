const { INIT_SERVICE, START_SERVICE } = require('@forrestjs/hooks');
const hooks = require('./hooks');
const tddHandler = require('./tdd-handler');
const initServiceHandler = require('./init-service-handler');
const startServiceHandler = require('./start-service-handler');

const service = {
  name: 'fastify',
  trace: __filename,
};

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);

  if (['development', 'test'].includes(process.env.NODE_ENV)) {
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
