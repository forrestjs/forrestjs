const { runHookApp } = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');

const registerRoute = require('./feature-register-route');
const registerRouteGET = require('./feature-register-route-get');

runHookApp({
  trace: 'compact',
  services: [serviceFastify],
  features: [registerRoute, registerRouteGET],
}).catch((err) => console.error(err));
