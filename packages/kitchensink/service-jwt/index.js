const forrestjs = require('@forrestjs/core');
const serviceJwt = require('@forrestjs/service-jwt');
const serviceFastify = require('@forrestjs/service-fastify');

const featureHome = require('./feature-home');

forrestjs({
  trace: 'compact',
  settings: {},
  services: [serviceFastify, serviceJwt], // The order doesn't matter
  features: [featureHome],
}).catch((err) => console.error(err));
