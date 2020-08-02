const { SERVICE } = require('@forrestjs/hooks');

const SERVICE_NAME = `${SERVICE} fastify`;
const FASTIFY_HACKS_BEFORE = `${SERVICE_NAME}/hacks/before`;
const FASTIFY_PLUGIN = `${SERVICE_NAME}/plugin`;
const FASTIFY_ROUTE = `${SERVICE_NAME}/route`;
const FASTIFY_HACKS_AFTER = `${SERVICE_NAME}/hacks/after`;

module.exports = {
  SERVICE_NAME,
  FASTIFY_HACKS_BEFORE,
  FASTIFY_PLUGIN,
  FASTIFY_ROUTE,
  FASTIFY_HACKS_AFTER,
};
