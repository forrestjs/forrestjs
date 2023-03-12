/**
 * You must provide a running PostgreSQL db to connect to:
 * PGSTRING=postgres://username:password@hostname:port/db
 * PGSTRING=postgres://postgres:postgres@localhost:5432/postgres
 */

const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const servicePg = require('@forrestjs/service-pg');

// Keep an idempotent definition of the feature's schema
// and data seed in SQL format:
const QUERY_DOWN = `DROP SCHEMA IF EXISTS "service_pg" CASCADE`;
const QUERY_UP = `
  -- Idempotend schema definition:
  CREATE SCHEMA IF NOT EXISTS "service_pg";
  CREATE TABLE IF NOT EXISTS "service_pg"."names" (
    "uname" TEXT NOT NULL PRIMARY KEY
  );

  -- Idempotent seeding:
  INSERT INTO "service_pg"."names" VALUES ('luke')
  ON CONFLICT ON CONSTRAINT "names_pkey"
  DO NOTHING;
`;

const f1 = () => [
  // Auto migrations at boot time
  // (good for really small services)
  {
    target: '$PG_READY',
    handler: ({ query }) => query(QUERY_UP),
  },
  // Resets the feature's schema in between tests
  {
    target: '$FASTIFY_TDD_RESET',
    handler:
      (_, { getContext }) =>
      async () => {
        const query = getContext('pg.query');
        await query(QUERY_DOWN);
        await query(QUERY_UP);
      },
  },

  // Exposes the seeded data via Fastify endpoint
  {
    target: '$FASTIFY_ROUTE',
    handler: {
      method: 'GET',
      url: '/names',
      handler: async (request) => {
        const res = await request.pg.query(
          'SELECT * FROM "service_pg"."names" LIMIT 10',
        );
        return res.rows;
      },
    },
  },
];

forrestjs({
  trace: 'compact',
  settings: {},
  services: [serviceFastify, servicePg],
  features: [f1],
}).catch((err) => console.error(err));
