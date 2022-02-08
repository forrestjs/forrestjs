const staticPlugin = require('fastify-static');
const { SERVICE_NAME, ...targets } = require('./targets');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.static', {});
  registerPlugin(staticPlugin, options);
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
