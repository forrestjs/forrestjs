const cookiePlugin = require('fastify-cookie');
const hooks = require('./hooks');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cookie', {});
  registerPlugin(cookiePlugin, options);
};

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: onFastifyHacksBefore,
  });
};
