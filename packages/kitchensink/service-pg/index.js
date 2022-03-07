const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const servicePg = require('@forrestjs/service-pg');

const f1 = () => [
  {
    target: '$PG_READY',
    handler: async ({ query }) => {
      await query(`
        -- Idempotend schema definition:
        CREATE SCHEMA IF NOT EXISTS "service_pg";
        CREATE TABLE IF NOT EXISTS "service_pg"."names" (
          "uname" TEXT NOT NULL PRIMARY KEY
        );

        -- Idempotent seeding:
        INSERT INTO "service_pg"."names" VALUES ('luke')
        ON CONFLICT ON CONSTRAINT "names_pkey"
        DO NOTHING;
      `);
    },
  },
  {
    target: '$FASTIFY_GET',
    handler: {
      url: '/names',
      handler: async (request) => {
        const res = await request.pg.query(
          'SELECT * FROM "service_pg"."names" LIMIT 10',
        );
        return res.rows;
      },
    },
  },
  {
    target: '$TDD_RESET',
    handler: async () => {
      console.log('@reset');
    },
  },
];

forrestjs({
  trace: 'compact',
  settings: {},
  services: [serviceFastify, servicePg],
  features: [f1],
}).catch((err) => console.error(err));
