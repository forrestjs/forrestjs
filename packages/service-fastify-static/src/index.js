const staticPlugin = require('@fastify/static');
const SERVICE_NAME = `fastify-static`;

const onFastifyPlugin = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.static', {});
  registerPlugin(staticPlugin, options);
};

module.exports = () => [
  {
    target: '$FASTIFY_PLUGIN',
    trace: __filename,
    name: SERVICE_NAME,
    handler: onFastifyPlugin,
  },
];
