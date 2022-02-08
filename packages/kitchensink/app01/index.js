const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceEnv = require('@forrestjs/service-env');
const serviceHash = require('@forrestjs/service-hash');

const featureHome = require('./feature-home');
const featureHash = require('./feature-hash');

forrestjs({
  trace: 'compact',
  settings: {
    hash: {
      rounds: 1,
    },
  },
  services: [serviceHash, serviceFastify, serviceEnv],
  features: [featureHome, featureHash],
}).catch((err) => console.error(err));
