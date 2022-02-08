const forrestjs = require('@forrestjs/core');
const serviceJwt = require('@forrestjs/service-jwt');
const serviceFastify = require('@forrestjs/service-fastify');

const featureHome = require('./feature-home');

forrestjs({
  trace: 'compact',
  settings: {},
  services: [serviceJwt, serviceFastify],
  features: [featureHome],
}).catch((err) => console.error(err));
