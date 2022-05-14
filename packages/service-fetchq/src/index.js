const fetchq = require('fetchq');
const { SERVICE_NAME, ...targets } = require('./targets');

const QUERY_DROP =
  'DROP SCHEMA "fetchq_data" CASCADE; DROP SCHEMA "fetchq" CASCADE;';

const onInitService = ({
  getConfig,
  getContext,
  setContext,
  createExtension,
}) => {
  // Decorate the Fetchq context with a reference to the getters in the targets app:
  const receivedConfig = getConfig('fetchq', {});

  // Let other services/features to inject APIs into Fetchq's workers' context.
  const { value: extendedContext } = createExtension.waterfall(
    '$FETCHQ_DECORATE_CONTEXT',
    {},
  );

  const applyConfig = {
    ...receivedConfig,
    decorateContext: {
      ...(receivedConfig.decorateContext ? receivedConfig.decorateContext : {}),
      ...extendedContext,
      getConfig,
      getContext,
    },
  };

  const client = fetchq(applyConfig);
  setContext('fetchq', client);
};

const onStartService = async ({ getConfig, getContext, createExtension }) => {
  const client = getContext('fetchq');

  // register feature's queues
  const queues = createExtension.sync('$FETCHQ_REGISTER_QUEUE', {
    fetchq: client,
  });
  queues.forEach((def) => {
    // queues array may not exists based on given settings
    if (!client.settings.queues) {
      client.settings.queues = [];
    }

    // each hook can return one single queue definition or a list
    const defs = Array.isArray(def[0]) ? def[0] : [def[0]];
    defs.forEach(($) => client.settings.queues.push($));
  });

  // register feature's workers
  const workers = createExtension.sync('$FETCHQ_REGISTER_WORKER', {
    fetchq: client,
  });
  workers.forEach((def) => {
    const defs = Array.isArray(def[0]) ? def[0] : [def[0]];
    defs.forEach(($) => client.workers.register($));
  });

  // Decorate Fetchq client to access context and configuration from the app
  client.getConfig = getConfig;
  client.getContext = getContext;

  await client.init();

  await createExtension.serie('$FETCHQ_BEFORE_START', { fetchq: client });

  await client.start();

  await createExtension.serie('$FETCHQ_READY', { fetchq: client });
};

module.exports = ({ registerExtension, registerTargets }) => {
  registerTargets(targets);

  registerExtension({
    target: '$INIT_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    priority: 100,
    handler: onInitService,
  });

  registerExtension({
    target: '$START_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    priority: 100,
    handler: onStartService,
  });

  /**
   * Provide the Fetchq client reference into Fastify's context
   */

  registerExtension({
    target: '$FASTIFY_PLUGIN?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ decorate, decorateRequest }, { getContext }) => {
      const fetchq = getContext('fetchq');
      decorate('fetchq', fetchq);
      decorateRequest('fetchq', fetchq);
    },
  });

  /**
   * HEALTHCHECK
   * Integrate with the TDD and Healthz preHandlers check so that
   * the app's status should await a working pool
   */

  const healthcheckHandler = async (request, reply, next) => {
    try {
      await request.fetchq.pool.query('SELECT NOW()');
      next();
    } catch (err) {
      reply.status(412).send('Fetchq client not yet ready');
    }
  };

  registerExtension({
    target: '$FASTIFY_TDD_CHECK?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: () => healthcheckHandler,
  });

  registerExtension({
    target: '$FASTIFY_HEALTHZ_CHECK?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: () => healthcheckHandler,
  });

  /**
   * TDD
   * Integrate with the Fastify TDD API
   */
  registerExtension({
    target: '$FASTIFY_TDD_ROUTE?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ registerTddRoute }, { createExtension }) => {
      const schemaFields = {
        type: 'object',
        properties: {
          q: { type: 'string' },
        },
        required: ['q'],
      };

      registerTddRoute({
        method: 'GET',
        url: '/fetchq/query',
        schema: { query: schemaFields },
        handler: (request) => {
          const { q: sql } = request.query;
          return request.fetchq.pool.query(sql);
        },
      });

      registerTddRoute({
        method: 'POST',
        url: '/fetchq/query',
        schema: { body: schemaFields },
        handler: (request) => {
          const { q: sql } = request.body;
          return request.fetchq.pool.query(sql);
        },
      });

      registerTddRoute({
        method: 'GET',
        url: '/fetchq/:queue/:subject',
        schema: {
          params: {
            type: 'object',
            properties: {
              queue: { type: 'string' },
              subject: { type: 'string' },
            },
            required: ['queue', 'subject'],
          },
        },
        handler: async (request, reply) => {
          const { queue, subject } = request.params;
          const result = await request.fetchq.pool.query(
            `
            SELECT * FROM "fetchq_data"."${queue}__docs"
            WHERE "subject" = '${subject}'
            `,
          );

          if (!result.rowCount) {
            reply.status(404).send('Document not found');
            return;
          }

          return result.rows[0];
        },
      });

      registerTddRoute({
        method: 'POST',
        url: '/fetchq/await/:queue/:subject',
        schema: {
          params: {
            type: 'object',
            properties: {
              queue: { type: 'string' },
              subject: { type: 'string' },
            },
            required: ['queue', 'subject'],
          },
          body: {
            type: 'object',
            properties: {
              status: { type: 'number', default: 3 },
              timeout: { type: 'number', default: 1000 },
              interval: { type: 'number', default: 100 },
            },
          },
        },
        handler: async (request, reply) => {
          const { queue, subject } = request.params;
          const { status, timeout, interval } = request.body;

          let checkInterval = null;
          let checkTimeout = null;
          let doc = null;

          checkInterval = setInterval(async () => {
            const result = await request.fetchq.pool.query(
              `
              SELECT * FROM "fetchq_data"."${queue}__docs"
              WHERE "subject" = '${subject}'
              `,
            );

            // Eagerly exit the processin in case there is no document at all
            if (!result.rowCount) {
              return;
            }

            // Persist last retrieved document version
            doc = result.rows[0];

            // Verify that the condition is met and break the loop
            if (Number(doc.status) === status) {
              clearTimeout(checkTimeout);
              clearInterval(checkInterval);
              reply.status(200).send(doc);
            }
          }, interval);

          // Interrupt the execution at the provided timeout
          checkTimeout = setTimeout(() => {
            clearInterval(checkInterval);
            reply.status(412).send(doc);
          }, timeout);
        },
      });

      registerTddRoute({
        method: 'GET',
        url: '/fetchq/state/reset',
        handler: async (request) => {
          const { fetchq } = request;
          const query = fetchq.pool.query.bind(fetchq.pool);

          // Destroy and recreate Fetchq's schema and related
          // data structure and workers
          await fetchq.stop();
          await query(QUERY_DROP);
          await fetchq.boot();

          // Run reset state integrations
          await createExtension.serie('$FETCHQ_TDD_STATE_RESET', {
            query,
          });

          return '+ok';
        },
      });
    },
  });
};
