const homeRouteHandler = async () => 'fetchq';

module.exports = {
  name: 'home',
  target: '$FASTIFY_ROUTE',
  handler: [{ method: 'GET', url: '/', handler: homeRouteHandler }],
};
