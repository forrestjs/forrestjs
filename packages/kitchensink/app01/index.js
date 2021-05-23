const { runHookApp } = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceEnv = require('@forrestjs/service-env');

const featureHome = require('./feature-home');

runHookApp({
  trace: 'compact',
  settings: {},
  services: [serviceEnv, serviceFastify],
  features: [featureHome],
}).catch((err) => console.error(err));
