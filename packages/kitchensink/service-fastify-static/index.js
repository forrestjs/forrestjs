const path = require('path');
const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyStatic = require('@forrestjs/service-fastify-static');

const featureCustomRoutes = require('./feature-custom-routes');

forrestjs({
  trace: 'compact',
  settings: {
    fastify: {
      meta: null,
      static: {
        root: path.join(__dirname, 'html'),
      },
    },
  },
  services: [serviceFastify, serviceFastifyStatic],
  features: [featureCustomRoutes],
}).catch((err) => console.error(err));
