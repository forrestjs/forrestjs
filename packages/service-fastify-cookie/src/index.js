const cookiePlugin = require('@fastify/cookie');

const service = {
  name: 'fastify-cookie',
  trace: __filename,
};

const onFastifyPlugin = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cookie', {});
  registerPlugin(cookiePlugin, options);
};

module.exports = () => [
  {
    ...service,
    target: '$FASTIFY_PLUGIN',
    handler: onFastifyPlugin,
  },
];
