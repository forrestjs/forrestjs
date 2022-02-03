const forrestjs = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyCors = require('@forrestjs/service-fastify-cors');
const featureCustomRoutes = require('./feature-custom-routes');

forrestjs({
  trace: 'compact',
  settings: {
    fastify: {},
  },
  services: [serviceFastify, serviceFastifyCors],
  features: [featureCustomRoutes],
}).catch((err) => console.error(err));
