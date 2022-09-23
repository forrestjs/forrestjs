const cookiePlugin = require('@fastify/cookie');
const SERVICE_NAME = `fastify-cookie`;

const onFastifyPlugin = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cookie', {});
  registerPlugin(cookiePlugin, options);
};

module.exports = () => [
  {
    name: SERVICE_NAME,
    trace: __filename,
    target: '$FASTIFY_PLUGIN',
    handler: onFastifyPlugin,
  },
];
