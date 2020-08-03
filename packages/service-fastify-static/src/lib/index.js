const staticPlugin = require('fastify-static');
const hooks = require('./hooks');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.static', {});
  registerPlugin(staticPlugin, options);
};

module.exports = ({ registerAction }) => {
  registerAction({
    hook: '$FASTIFY_PLUGIN',
    name: hooks.SERVICE_NAME,
    trace: __filename,
    handler: onFastifyHacksBefore,
  });
};
