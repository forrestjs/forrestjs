const { runHookApp } = require('@forrestjs/hooks');
const serviceJwt = require('@forrestjs/service-jwt');
const serviceFastify = require('@forrestjs/service-fastify');

const featureHome = require('./feature-home');

runHookApp({
  trace: 'compact',
  settings: {},
  services: [serviceJwt, serviceFastify],
  features: [featureHome],
}).catch((err) => console.error(err));
