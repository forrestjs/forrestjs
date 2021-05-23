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
};
