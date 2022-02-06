const forrestjs = require('@forrestjs/hooks');
const serviceLogger = require('@forrestjs/service-logger');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyHealthz = require('@forrestjs/service-fastify-healthz');

const customCheck = () => ({
  hook: '$FASTIFY_HEALTHZ_CHECK',
  handler: () => (request, reply, next) => {
    request.log.info('Run some custom checks');
    setTimeout(next, 10);
  },
});

forrestjs({
  trace: 'compact',
  settings: {
    fastify: {
      instance: {
        options: {
          logger: true,
        },
      },
    },
  },
  services: [serviceLogger, serviceFastify, serviceFastifyHealthz],
  features: [customCheck],
}).catch((err) => console.error(err));
