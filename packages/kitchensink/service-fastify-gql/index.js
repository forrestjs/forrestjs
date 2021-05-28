const { runHookApp } = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyGQL = require('@forrestjs/service-fastify-gql');

const featureHome = require('./feature-home');
const featurePing = require('./feature-ping');

runHookApp({
  trace: 'compact',
  settings: {
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
