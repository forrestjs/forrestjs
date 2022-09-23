const staticPlugin = require('@fastify/static');

const service = {
  name: 'fastify-static',
  trace: __filename,
};

const onFastifyPlugin = ({ registerPlugin }, { getConfig }) => {
  const options = getConfig('fastify.static', {});
  registerPlugin(staticPlugin, options);
};

module.exports = () => [
  {
    ...service,
    target: '$FASTIFY_PLUGIN',
    handler: onFastifyPlugin,
  },
];
