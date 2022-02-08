import { INIT_SERVICE, START_SERVICE } from '@forrestjs/core';
import * as hooks from './hooks';

import { default as init } from './init';
import { default as start } from './start';
import { getHandler, getModel, resetModels } from './conn';
import { default as query } from './query';

export { default as init } from './init';
export { default as start } from './start';
export { default as query } from './query';
export { getHandler, getModel, registerModel, resetModels } from './conn';

export default ({ registerHook, registerAction, createHook }) => {
  registerHook(hooks);

  registerAction({
    hook: INIT_SERVICE,
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: async ({ getConfig, setContext, getContext }, ctx) => {
      const connections = getConfig('postgres.connections');

      // Let features hook into the existing connections configuration
      createHook.sync(hooks.POSTGRES_BEFORE_INIT, { connections });

      for (const options of connections) {
        // #18 apply defaults to the models list
        if (!options.models) {
          options.models = [];
        }

        const connName = options.connectionName || 'default';
        createHook.sync(`${hooks.POSTGRES_BEFORE_INIT}/${connName}`, {
          options,
        });
        await init(options, ctx);
        createHook.sync(`${hooks.POSTGRES_AFTER_INIT}/${connName}`, {
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

      createHook.sync(hooks.POSTGRES_AFTER_INIT, {
        ...getContext('pg'),
        connections,
      });
    },
  });

  registerAction({
    hook: START_SERVICE,
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: async ({ getConfig, getContext }, ctx) => {
      const connections = getConfig('postgres.connections');

      await createHook.serie(hooks.POSTGRES_BEFORE_START, {
        ...getContext('pg'),
        connections,
      });

      for (const options of connections) {
        const connName = options.connectionName || 'default';
        createHook.serie(`${hooks.POSTGRES_BEFORE_START}/${connName}`, {
          ...getContext('pg'),
          registerModel: (model) => options.models.push(model),
        });
        await start(options, ctx);
        createHook.serie(`${hooks.POSTGRES_AFTER_START}/${connName}`, {
          ...getContext('pg'),
          handler: getHandler(connName),
        });
      }

      await createHook.serie(hooks.POSTGRES_AFTER_START, {
        ...getContext('pg'),
        connections,
      });
    },
  });
};
