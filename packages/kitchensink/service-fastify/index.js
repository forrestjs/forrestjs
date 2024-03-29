const forrest = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');

const registerRoute = require('./feature-register-route');
const registerRouteGET = require('./feature-register-route-get');
const registerTddRoute = require('./feature-register-tdd-route');

const addStuffIntoReset = () => ({
  target: '$FASTIFY_TDD_RESET',
  handler: ({ registerTddReset }) => {
    // You can just provide an anonymous handler:
    registerTddReset(() => 'unknownHandler');

    // Or you can give it a name:
    registerTddReset(() => 'first', 'firstHandler');

    // Handlers can be asynchronous:
    registerTddReset(
      () => new Promise((r) => setTimeout(() => r('asyncHandler'), 100)),
      'asyncHandler',
    );

    // You can also return the handler, it will be
    // register with the same function as here above
    const returningHandler = () => 'returninHandler';
    return returningHandler;
  },
});

forrest
  .run({
    trace: 'compact',
    settings: {
      custom: {
        string: 'val',
        number: 123,
        boolean: {
          true: true,
          false: false,
        },
      },
    },
    services: [serviceFastify],
    features: [
      registerRoute,
      registerRouteGET,
      registerTddRoute,
      addStuffIntoReset,
    ],
  })
  .catch((err) => console.error(err));
