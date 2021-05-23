const { runHookApp } = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceEnv = require('@forrestjs/service-env');
const serviceHash = require('@forrestjs/service-hash');

const featureHome = require('./feature-home');
const featureHash = require('./feature-hash');

runHookApp({
  trace: 'compact',
  settings: {
    hash: {
      rounds: 1,
    },
  },
  services: [serviceEnv, serviceHash, serviceFastify],
  features: [featureHome, featureHash],
}).catch((err) => console.error(err));
