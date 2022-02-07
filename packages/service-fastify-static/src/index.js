const staticPlugin = require('fastify-static');
const targets = require('./targets');

const onFastifyHacksBefore = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.static', {});
  registerPlugin(staticPlugin, options);
};

module.exports = ({ registerAction }) => {
  registerAction({
    target: '$FASTIFY_PLUGIN',
    name: targets.SERVICE_NAME,
    trace: __filename,
    handler: onFastifyHacksBefore,
  });
};
