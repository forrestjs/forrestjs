const corsPlugin = require('fastify-cors');
const hooks = require('./hooks');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cors', {});
  registerPlugin(corsPlugin, options);
};

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: onFastifyHacksBefore,
  });
};
