/**
 * You must provide a running PostgreSQL db to connect to:
 * PGSTRING=postgres://username:password@hostname:port/db
 * PGSTRING=postgres://postgres:postgres@localhost:5432/postgres
 */

const forrestjs = require('@forrestjs/core');
const serviceLogger = require('@forrestjs/service-logger');
const serviceFetchq = require('@forrestjs/service-fetchq');
const serviceFetchqTask = require('@forrestjs/service-fetchq-task');
const serviceFastify = require('@forrestjs/service-fastify');

const taskWithCursor = {
  payload: { c: 0 },
  handler: (doc, { log }) => {
    log.info(`${doc.subject}> Cursor: ${doc.payload.c}`);
    return doc.reschedule('+1s', {
      payload: {
        c: doc.payload.c + 1,
      },
    });
  },
};

forrestjs({
  trace: 'compact',
  settings: {
    fetchq: {
      logLevel: 'error',
      pool: { max: 1 },
      task: {
        // Customize the queue that will handle tasks
        queue: {
          name: 'foobar',
        },
        // Configure the worker
        worker: {
          settings: {
            concurrency: 4,
          },
        },
        // Register one or more tasks at config time
        register: [
          {
            subject: 't1',
            // Will re-write the original payload at boot time
            resetOnBoot: true,
            ...taskWithCursor,
          },
        ],
      },
    },
  },
  services: [
    serviceLogger,
    serviceFetchq, // The order is not important
    serviceFastify,
    serviceFetchqTask,
  ],
  features: [
    // Register one task as a Feature
    {
      target: '$FETCHQ_REGISTER_TASK',
      handler: {
        subject: 't2',
        ...taskWithCursor,
      },
    },
  ],
}).catch((err) => console.error(err));
