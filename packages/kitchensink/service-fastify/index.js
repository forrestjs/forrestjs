const { runHookApp } = require('@forrestjs/hooks');

const serviceFastify = require('@forrestjs/service-fastify');

const registerRoute = require('./feature-register-route');
const registerRouteGET = require('./feature-register-route-get');
const registerTddRoute = require('./feature-register-tdd-route');

runHookApp({
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
  features: [registerRoute, registerRouteGET, registerTddRoute],
}).catch((err) => console.error(err));
