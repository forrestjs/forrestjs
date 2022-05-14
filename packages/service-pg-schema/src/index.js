const targets = require('./targets');

const pgSchema = ({ registerTargets }) => {
  registerTargets(targets);

  return [
    {
      trace: __filename,
      target: '$PG_READY',
      handler: async ({ query }, { createExtension, getConfig }) => {
        const buildConfig = getConfig('pgSchema.build', {});
        const seedConfig = getConfig('pgSchema.seed', {});

        await createExtension.serie('$PG_SCHEMA_BUILD', {
          query,
          config: buildConfig,
        });
        await createExtension.serie('$PG_SCHEMA_SEED', {
          query,
          config: seedConfig,
        });
      },
    },
    {
      trace: __filename,
      target: '$FASTIFY_TDD_RESET?',
      handler:
        (_, { createExtension, getConfig, getContext }) =>
        async () => {
          const query = getContext('pg.query');

          const buildConfig = getConfig('pgSchema.build', {});
          const seedConfig = getConfig('pgSchema.seed', {});
          const resetConfig = getConfig('pgSchema.reset', {});

          await createExtension.serie('$PG_SCHEMA_RESET', {
            query,
            config: resetConfig,
          });
          await createExtension.serie('$PG_SCHEMA_BUILD', {
            query,
            config: buildConfig,
          });
          await createExtension.serie('$PG_SCHEMA_SEED', {
            query,
            config: seedConfig,
          });
        },
    },
  ];
};

module.exports = pgSchema;
