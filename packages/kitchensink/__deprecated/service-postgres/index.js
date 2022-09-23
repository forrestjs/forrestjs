/**
 * You must provide a running PostgreSQL db to connect to:
 * PGSTRING=postgres://username:password@hostname:port/db
 */

const forrestjs = require('@forrestjs/core');
const servicePostgres = require('@forrestjs/service-postgres');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceFastifyHealthz = require('@forrestjs/service-fastify-healthz');

forrestjs({
  trace: 'compact',
  settings: {
    postgres: {
      connections: [
        {
          host: 'tyke.db.elephantsql.com',
          port: 5432,
          database: 'xtxoyaqe',
          username: 'xtxoyaqe',
          password: '--',
        },
      ],
    },
  },
  services: [
    //  serviceLogger,
    //  serviceJwt,
    servicePostgres,
    serviceFastify,
    serviceFastifyHealthz,
  ],
  features: [],
}).catch((err) => console.error(err));
