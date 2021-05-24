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
    hook: '$FASTIFY_HACKS_AFTER?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ fastify }, { getContext }) => {
      const getEnv = getContext('getEnv');

      // Prepare the shape of the decorators
      fastify.decorate('getEnv', getEnv);
      fastify.decorateRequest('getEnv', null);
      fastify.decorateReply('getEnv', null);

      // Add the references using hooks to comply with the decoratos API
      // https://www.fastify.io/docs/v3.15.x/Decorators/

      fastify.addHook('onRequest', (request, reply, done) => {
        request.getEnv = getEnv;
        done();
      });

      fastify.addHook('onResponse', (request, reply, done) => {
        reply.getEnv = getEnv;
        done();
      });
    },
  });
};
