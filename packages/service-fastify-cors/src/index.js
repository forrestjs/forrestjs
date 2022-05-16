const corsPlugin = require('@fastify/cors');
const { SERVICE_NAME, ...targets } = require('./targets');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cors', {});
  registerPlugin(corsPlugin, options);
};

module.exports = ({ registerTargets }) => {
  registerTargets(targets);

  return [
    {
      target: '$FASTIFY_PLUGIN',
      trace: __filename,
      name: SERVICE_NAME,
      handler: onFastifyHacksBefore,
    },
  ];
};
