const homeRouteHandler = async () => 'fetchq';

module.exports = {
  name: 'home',
  target: '$FASTIFY_GET',
  handler: [{ url: '/', handler: homeRouteHandler }],
};
