const service = {
  ...service,
  name: 'pg-schema',
};

const pgSchema = ({ registerTargets }) => {
  registerTargets({
    PG_SCHEMA_BUILD: `${service.name}/build`,
    PG_SCHEMA_RESET: `${service.name}/reset`,
    PG_SCHEMA_SEED: `${service.name}/seed`,
  });

  return [
    {
      ...service,
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
      ...service,
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
