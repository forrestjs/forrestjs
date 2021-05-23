const { runHookApp } = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFetchq = require('@forrestjs/service-fetchq');

const featureHome = require('./feature-home');

runHookApp({
  trace: 'compact',
  settings: {},
  services: [serviceFetchq, serviceFastify],
  features: [featureHome],
}).catch((err) => console.error(err));
