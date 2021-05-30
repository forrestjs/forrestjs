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
    name: hooks.SERVICE_NAME,
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
    name: hooks.SERVICE_NAME,
    trace: __filename,
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
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: () => healthcheckHandler,
  });

  registerAction({
    hook: '$FASTIFY_HEALTHZ_CHECK?',
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: () => healthcheckHandler,
  });
};
