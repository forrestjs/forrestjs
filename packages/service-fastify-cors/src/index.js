const corsPlugin = require('@fastify/cors');

const service = {
  name: 'fastify-cors',
  trace: __filename,
};

const onFastifyPlugin = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.cors', {});
  registerPlugin(corsPlugin, options);
};

module.exports = () => [
  {
    ...service,
    target: '$FASTIFY_PLUGIN',
    handler: onFastifyPlugin,
  },
];
