const { SERVICE } = require('@forrestjs/hooks');

const SERVICE_NAME = `${SERVICE} fastify-healthz`;
const FASTIFY_HEALTHZ_HANDLER = `${SERVICE_NAME}/hanlder`;

module.exports = {
  SERVICE_NAME,
  FASTIFY_HEALTHZ_HANDLER,
};
