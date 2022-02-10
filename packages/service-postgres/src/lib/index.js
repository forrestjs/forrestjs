import * as targets from './targets';

import { default as init } from './init';
import { default as start } from './start';
import { getHandler, getModel, resetModels } from './conn';
import { default as query } from './query';

export { default as init } from './init';
export { default as start } from './start';
export { default as query } from './query';
export { getHandler, getModel, registerModel, resetModels } from './conn';

export default ({ registerTargets, registerAction, createExtension }) => {
  registerTargets(targets);

  registerAction({
    target: '$INIT_SERVICE',
    name: '$SERVICE_NAME',
    trace: __filename,
    handler: async ({ getConfig, setContext, getContext }, ctx) => {
      const connections = getConfig('postgres.connections');

      // Let features hook into the existing connections configuration
      createExtension.sync('$POSTGRES_BEFORE_INIT', { connections });

      for (const options of connections) {
        // #18 apply defaults to the models list
        if (!options.models) {
          options.models = [];
        }

        const connName = options.connectionName || 'default';
        createExtension.sync(`${targets.POSTGRES_BEFORE_INIT}/${connName}`, {
          options,
        });
        await init(options, ctx);
        createExtension.sync(`${targets.POSTGRES_AFTER_INIT}/${connName}`, {
          options,
        });
      }

      // Decorate the context with the PG context
      setContext('pg', {
        query,
        getModel,
        getHandler,
        resetModels,
      });

      createExtension.sync('$POSTGRES_AFTER_INIT', {
        ...getContext('pg'),
        connections,
      });
    },
  });

  registerAction({
    target: '$START_SERVICE',
    name: '$SERVICE_NAME',
    trace: __filename,
    handler: async ({ getConfig, getContext }, ctx) => {
      const connections = getConfig('postgres.connections');

      await createExtension.serie('$POSTGRES_BEFORE_START', {
        ...getContext('pg'),
        connections,
      });

      for (const options of connections) {
        const connName = options.connectionName || 'default';
        createExtension.serie(`${targets.POSTGRES_BEFORE_START}/${connName}`, {
          ...getContext('pg'),
          registerModel: (model) => options.models.push(model),
        });
        await start(options, ctx);
        createExtension.serie(`${targets.POSTGRES_AFTER_START}/${connName}`, {
          ...getContext('pg'),
          handler: getHandler(connName),
        });
      }

      await createExtension.serie('$POSTGRES_AFTER_START', {
        ...getContext('pg'),
        connections,
      });
    },
  });
};
