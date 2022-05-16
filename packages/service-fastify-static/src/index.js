const staticPlugin = require('@fastify/static');
const { SERVICE_NAME, ...targets } = require('./targets');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.static', {});
  registerPlugin(staticPlugin, options);
};

module.exports = ({ registerTargets }) => {
  registerTargets(targets);

  return {
    target: '$FASTIFY_PLUGIN',
    trace: __filename,
    name: SERVICE_NAME,
    handler: onFastifyHacksBefore,
  };
};
