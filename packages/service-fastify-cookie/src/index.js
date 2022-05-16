const cookiePlugin = require('@fastify/cookie');
const { SERVICE_NAME, ...targets } = require('./targets');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cookie', {});
  registerPlugin(cookiePlugin, options);
};

module.exports = ({ registerTargets }) => {
  registerTargets(targets);

  return [
    {
      name: SERVICE_NAME,
      trace: __filename,
      target: '$FASTIFY_PLUGIN',
      handler: onFastifyHacksBefore,
    },
  ];
};
