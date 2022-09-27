const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceLogger = require('@forrestjs/service-logger');

const logSomething = () => ({
  target: '$INIT_FEATURE',
  handler: ({ log }) => {
    log.error('This is an ERROR log');
    log.warn('This is an WARN log');
    log.info('This is an INFO log');
    log.verbose('This is an VERBOSE log');
    log.debug('This is an DEBUG log');
    log.silly('This is an SILLY log');
  },
});

const homePage = () => ({
  target: '$FASTIFY_ROUTE',
  handler: {
    method: 'GET',
    url: '/',
    handler: (request, reply) => {
      request.log.error('This is an ERROR log');
      request.log.warn('This is an WARN log');
      request.log.info('This is an INFO log');
      request.log.verbose('This is an VERBOSE log');
      request.log.debug('This is an DEBUG log');
      request.log.silly('This is an SILLY log');
      reply.send('hoho');
    },
  },
});

forrestjs({
  // trace: 'compact',
  settings: {
    logger: {
      level: 'info',
    },
  },
  services: [serviceLogger, serviceFastify],
  features: [homePage, logSomething],
}).catch((err) => console.error(err));
