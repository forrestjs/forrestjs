/**
 * Keeps a pooled connection to PostgreSQL
 */

const { Pool } = require('pg');
const targets = require('./targets');

const pg = ({ registerExtension, registerTargets }) => {
  // Register pg's extension points into ForrestJS hooks dictionary:
  registerTargets(targets);

  registerExtension({
    // run before Fastify init - needed to provide `request.query`
    trace: __filename,
    priority: 10,
    target: '$INIT_SERVICE',
    handler: ({ getConfig, setContext }) => {
      // Gather configuration from the APP:
      const connectionString = getConfig(
        'pg.connectionString',
        process.env.PGSTRING,
      );

      // Error management behavior:
      const exitOnError = getConfig(
        'pg.exitOnError',
        process.env.SERVICE_PG_EXIT_ON_ERROR || false,
      );

      // Get configuration
      const maxConnections = getConfig(
        'pg.maxConnections',
        process.env.SERVICE_PG_MAX_CONNECTIONS || 10,
      );
      const poolConfig = getConfig('pg.poolConfig', {});

      // Instanciate the PG pool:
      const pool = new Pool({
        ...poolConfig,
        connectionString,
        max: maxConnections,
      });

      pool.on('error', (err, client) => {
        console.error('Unexpected error on idle client', err.message);
        if (exitOnError) {
          process.exit(-1);
        }
      });

      // Export the pool instance to the App Context:
      setContext('pg.pool', pool);

      // Export a straightforward query utility to the APP Context:
      const query = pool.query.bind(pool);
      setContext('pg.query', query);
    },
  });

  registerExtension({
    trace: __filename,
    target: '$START_SERVICE',
    handler: async ({ getContext, createExtension }) => {
      // Get a reqference to the PG pool instance:
      const pool = getContext('pg.pool');
      const query = getContext('pg.query');

      // Try to collect the server's time to prove the connection is established:
      try {
        const res = await pool.query(`SELECT now() AS "pgtime"`);
        // console.info(`Successfully connected to Postgres`);
        // console.info(`pgtime: ${res.rows[0].pgtime}`);
      } catch (err) {
        throw new Error(`Could not connect to PostgreSQL`);
      }

      // Call the hook, passing down arguments into it:
      try {
        await createExtension.serie(`$PG_READY`, { query, pool });
      } catch (err) {
        throw new Error(`PG_READY Error: ${err.message}`);
      }
    },
  });

  registerExtension({
    trace: __filename,
    target: '$FASTIFY_PLUGIN?',
    handler: ({ decorateRequest }, { getContext }) => {
      const query = getContext('pg.query');
      decorateRequest('pg', { query });
    },
  });

  /**
   * HEALTHCHECK
   * Integrate with the TDD and Healthz preHandlers check so that
   * the app's status should await a working pool
   */

  const healthcheckHandler = async (request, reply, next) => {
    try {
      const res = await request.pg.query(`SELECT now() AS "pgtime"`);
      // console.info(`[service-pg] Healthcheck pass: ${res.rows[0].pgtime}`);
      next();
    } catch (err) {
      reply.status(412).send('Fetchq client not yet ready');
    }
  };

  registerExtension({
    trace: __filename,
    target: '$FASTIFY_TDD_CHECK?',
    handler: () => healthcheckHandler,
  });

  registerExtension({
    trace: __filename,
    target: '$FASTIFY_HEALTHZ_CHECK?',
    handler: () => healthcheckHandler,
  });

  /**
   * TDD
   * Integrate with the Fastify TDD API
   */
  registerExtension({
    trace: __filename,
    target: '$FASTIFY_TDD_ROUTE?',
    handler: ({ registerTddRoute }) => {
      const schemaFields = {
        type: 'object',
        properties: {
          q: { type: 'string' },
        },
        required: ['q'],
      };

      registerTddRoute({
        method: 'GET',
        url: '/pg/query',
        schema: { query: schemaFields },
        handler: (request) => {
          const { q: sql } = request.query;
          return request.pg.query(sql);
        },
      });

      registerTddRoute({
        method: 'POST',
        url: '/pg/query',
        schema: { body: schemaFields },
        handler: (request) => {
          const { q: sql, p: params = [] } = request.body;
          return request.pg.query(sql, params);
        },
      });
    },
  });
};

module.exports = pg;
