const { runHookApp } = require('@forrestjs/hooks');
const serviceLogger = require('@forrestjs/service-logger');
const serviceFetchq = require('@forrestjs/service-fetchq');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyHealthz = require('@forrestjs/service-fastify-healthz');

const featureHome = require('./feature-home');
const featureQ1 = require('./feature-q1');

runHookApp({
  trace: 'compact',
  settings: {
    fetchq: {
      logLevel: 'error',
      pool: { max: 1 },
    },
  },
  services: [
    serviceLogger,
    serviceFetchq,
    serviceFastify,
    serviceFastifyHealthz,
  ],
  features: [featureHome, featureQ1],
}).catch((err) => console.error(err));
