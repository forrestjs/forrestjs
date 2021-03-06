/**
 * Extends `process.env` with informations from local files:
 *
 * .env
 * .env.local
 * .env.[development|production|...]
 * .env.[development|production|...].local
 *
 */

const { SERVICE_NAME } = require('./hooks');
const { initEnv } = require('./init-env');

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$START',
    name: SERVICE_NAME,
    trace: __filename,
    handler: initEnv,
  });

  // Fastify Integration (optional hook)
  registerAction({
    hook: '$FASTIFY_PLUGIN?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ decorate, decorateRequest }, { getContext }) => {
      const getEnv = getContext('getEnv');
      decorate('getEnv', getEnv);
      decorateRequest('getEnv', getEnv);
    },
  });
};
