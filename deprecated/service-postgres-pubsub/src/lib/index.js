import PGPubsub from '@fetchq/pg-pubsub';
import * as targets from './hooks';

const connections = {};

export const addChannel = (channelName, fn, connectionName = 'default') => {
  connections[connectionName].addChannel(channelName, fn);
  return () => connections[connectionName].removeChannel(channelName, fn);
};

export const once = (channelName, fn, connectionName = 'default') => {
  const cb = (data) => {
    removeChannel(); // eslint-disable-line
    fn(data);
  };
  const removeChannel = addChannel(channelName, cb, connectionName);
};

export const publish = (channelName, data, connectionName = 'default') => {
  connections[connectionName].publish(channelName, data);
};

export default ({ registerTargets, registerAction, createExtension }) => {
  registerTargets(targets);

  registerAction({
    target: '$INIT_FEATURES',
    name: targets.SERVICE_NAME,
    trace: __filename,
    handler: async ({ getConfig }) => {
      const postgresPubsub = getConfig('postgresPubSub');

      postgresPubsub.forEach((config) => {
        const connectionName = config.connectionName || 'default';
        const uri = [
          'postgres://',
          `${config.username}:${config.password}`,
          '@',
          `${config.host}:${config.port}`,
          '/',
          config.database,
        ].join('');

        connections[connectionName] = new PGPubsub(uri);
        connections[connectionName].publish('ping', Date.now());
      });

      createExtension.sync('$POSTGRES_PUBSUB_START', {
        addChannel,
        once,
        publish,
      });
    },
  });
};
