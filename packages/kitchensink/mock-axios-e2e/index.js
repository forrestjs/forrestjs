const { runHookApp } = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');

const featureJokes = require('./feature-jokes');

runHookApp({
  trace: 'compact',
  settings: {
    hash: {
      rounds: 1,
    },
  },
  services: [serviceFastify],
  features: [featureJokes],
}).catch((err) => console.error(err));
