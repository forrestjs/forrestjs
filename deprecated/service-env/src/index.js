/**
 * Extends `process.env` with informations from local files:
 *
 * .env
 * .env.local
 * .env.[development|production|...]
 * .env.[development|production|...].local
 *
 */

const { initEnv } = require('./init-env');

const service = {
  name: 'env',
  trace: __filename,
};

module.exports = () => [
  {
    ...service,
    target: '$START',
    handler: initEnv,
  },
  {
    ...service,
    target: '$INIT_SERVICE',
    handler: ({ log }) =>
      log.warn(
        'Package `service-env` has been deprecated and will be removed from v6.x',
      ),
  },
  {
    ...service,
    target: '$FASTIFY_PLUGIN?',
    handler: ({ decorate, decorateRequest }, { getContext }) => {
      const getEnv = getContext('getEnv');
      decorate('getEnv', getEnv);
      decorateRequest('getEnv', getEnv);
    },
  },
];
