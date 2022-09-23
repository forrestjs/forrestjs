const corsPlugin = require('@fastify/cors');
const SERVICE_NAME = `fastify-cors`;

const onFastifyPlugin = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cors', {});
  registerPlugin(corsPlugin, options);
};

module.exports = () => [
  {
    target: '$FASTIFY_PLUGIN',
    trace: __filename,
    name: SERVICE_NAME,
    handler: onFastifyPlugin,
  },
];
