const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyGQL = require('@forrestjs/service-fastify-gql');

const featureHome = require('./feature-home');
const featurePing = require('./feature-ping');

forrestjs({
  trace: 'compact',
  settings: {
    ping: {
      message: '+ok',
    },
    fastify: {
      gql: {
        playground: true,
        introspection: true,
      },
    },
  },
  services: [serviceFastify, serviceFastifyGQL],
  features: [featureHome, featurePing],
}).catch((err) => console.error(err));
