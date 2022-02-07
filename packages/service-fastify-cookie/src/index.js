const cookiePlugin = require('fastify-cookie');
const actions = require('./actions');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cookie', {});
  registerPlugin(cookiePlugin, options);
};

module.exports = ({ registerExtension }) => {
  registerExtension({
    action: '$FASTIFY_PLUGIN',
    name: actions.SERVICE_NAME,
    trace: __filename,
    handler: onFastifyHacksBefore,
  });
};
