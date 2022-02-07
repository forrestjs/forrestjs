const cookiePlugin = require('fastify-cookie');
const { SERVICE_NAME, ...targets } = require('./targets');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cookie', {});
  registerPlugin(cookiePlugin, options);
};

module.exports = ({ registerTargets, registerAction }) => {
  registerTargets(targets);
  registerAction({
    name: SERVICE_NAME,
    target: '$FASTIFY_PLUGIN',
    trace: __filename,
    handler: onFastifyHacksBefore,
  });
};
