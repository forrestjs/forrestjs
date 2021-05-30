const homeRouteHandler = async () => 'fetchq';

module.exports = {
  name: 'home',
  hook: '$FASTIFY_GET',
  handler: [{ url: '/', handler: homeRouteHandler }],
};
