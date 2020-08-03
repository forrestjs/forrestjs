const { SERVICE } = require('@forrestjs/hooks');

const SERVICE_NAME = `${SERVICE} fetchq`;
const FETCHQ_REGISTER_QUEUE = `${SERVICE} fetchq/register/queue`;
const FETCHQ_REGISTER_WORKER = `${SERVICE} fetchq/register/worker`;
const FETCHQ_READY = `${SERVICE} fetchq/ready`;
const FETCHQ_BEFORE_START = `${SERVICE} fetchq/before-start`;

module.exports = {
  SERVICE_NAME,
  FETCHQ_REGISTER_QUEUE,
  FETCHQ_REGISTER_WORKER,
  FETCHQ_READY,
  FETCHQ_BEFORE_START,
};
