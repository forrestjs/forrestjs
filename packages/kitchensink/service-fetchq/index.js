const { runHookApp } = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFetchq = require('@forrestjs/service-fetchq');

const featureHome = require('./feature-home');
const featureQ1 = require('./feature-q1');

runHookApp({
  trace: 'compact',
  settings: {
    fetchq: {
      logLevel: 'error',
      pool: {
        max: 1,
      },
    },
  },
  services: [serviceFetchq, serviceFastify],
  features: [featureHome, featureQ1],
}).catch((err) => console.error(err));
