const corsPlugin = require('fastify-cors');
const { SERVICE_NAME, ...targets } = require('./targets');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cors', {});
  registerPlugin(corsPlugin, options);
};

module.exports = ({ registerTargets, registerAction }) => {
  registerTargets(targets);
  registerAction({
    target: '$FASTIFY_PLUGIN',
    name: SERVICE_NAME,
    trace: __filename,
    handler: onFastifyHacksBefore,
  });
};
