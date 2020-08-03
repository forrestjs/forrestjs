const { SERVICE } = require('@forrestjs/hooks');

const SERVICE_NAME = `${SERVICE} fastify-gql`;
const FASTIFY_GQL_EXTEND_SCHEMA = `${SERVICE_NAME}/extend-schema`;
const FASTIFY_GQL_EXTEND_CONTEXT = `${SERVICE_NAME}/extend-context`;

module.exports = {
  SERVICE_NAME,
  FASTIFY_GQL_EXTEND_SCHEMA,
  FASTIFY_GQL_EXTEND_CONTEXT,
};
