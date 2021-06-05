const fetchq = require('fetchq');
const { SERVICE_NAME, ...hooks } = require('./hooks');

const onInitService = ({ getConfig, getContext, setContext, createHook }) => {
  // Decorate the Fetchq context with a reference to the getters in the hooks app:
  const receivedConfig = getConfig('fetchq', {});
  const applyConfig = {
    ...receivedConfig,
    decorateContext: {
      ...(receivedConfig.decorateContext ? receivedConfig.decorateContext : {}),
      getConfig,
      getContext,
    },
  };

  const client = fetchq(applyConfig);
  setContext('fetchq', client);
};

const onStartService = async ({ getConfig, getContext, createHook }) => {
  const client = getContext('fetchq');

  // register feature's queues
  const queues = createHook.sync(hooks.FETCHQ_REGISTER_QUEUE, {
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
  const workers = createHook.sync(hooks.FETCHQ_REGISTER_WORKER, {
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

  await createHook.serie(hooks.FETCHQ_BEFORE_START, { fetchq: client });

  await client.start();

  await createHook.serie(hooks.FETCHQ_READY, { fetchq: client });
};

module.exports = ({ registerAction, registerHook }) => {
  registerHook(hooks);

  registerAction({
    hook: '$INIT_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    handler: onInitService,
  });

  registerAction({
    hook: '$START_SERVICE',
    name: SERVICE_NAME,
    trace: __filename,
    handler: onStartService,
  });

  /**
   * Provide the Fetchq client reference into Fastify's context
   */

  registerAction({
    hook: '$FASTIFY_HACKS_BEFORE?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ fastify }, { getContext }) => {
      const fetchq = getContext('fetchq');

      // Prepare the shape of the decorators
      fastify.decorate('fetchq', fetchq);
      fastify.decorateRequest('fetchq', null);

      // Add the references using hooks to comply with the decoratos API
      // https://www.fastify.io/docs/v3.15.x/Decorators/

      fastify.addHook('onRequest', (request, reply, done) => {
        request.fetchq = fetchq;
        done();
      });
    },
  });

  /**
   * Integrate with the Fastify TDD API
   */

  registerAction({
    hook: '$FASTIFY_TDD_ROUTE?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: ({ registerTddRoute }, { createHook }) => {
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
          await query(
            'DROP SCHEMA "fetchq_data" CASCADE; DROP SCHEMA "fetchq" CASCADE;',
          );
          await fetchq.boot();

          await createHook.serie(hooks.FETCHQ_TDD_STATE_RESET, { query });
          return '+ok';
        },
      });
    },
  });

  /**
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

  registerAction({
    hook: '$FASTIFY_TDD_CHECK?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: () => healthcheckHandler,
  });

  registerAction({
    hook: '$FASTIFY_HEALTHZ_CHECK?',
    name: SERVICE_NAME,
    trace: __filename,
    handler: () => healthcheckHandler,
  });
};
