const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');

const githubUser = require('./github-user');

forrestjs({
  trace: 'compact',
  settings: {
    hash: {
      rounds: 1,
    },
  },
  services: [serviceFastify],
  features: [githubUser],
}).catch((err) => console.error(err));
