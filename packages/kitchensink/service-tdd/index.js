const { runHookApp } = require('@forrestjs/hooks');

const serviceFastify = require('@forrestjs/service-fastify');
const serviceTDD = require('@forrestjs/service-tdd');

runHookApp({
  trace: 'compact',
  services: [serviceFastify, serviceTDD],
  features: [],
}).catch((err) => console.error(err));
