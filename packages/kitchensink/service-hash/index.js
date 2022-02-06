const forrestjs = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceHash = require('@forrestjs/service-hash');

const featureHome = require('./feature-home');

forrestjs({
  trace: 'compact',
  settings: {
    hash: {
      rounds: 1,
    },
  },
  services: [serviceHash, serviceFastify],
  features: [featureHome],
}).catch((err) => console.error(err));
