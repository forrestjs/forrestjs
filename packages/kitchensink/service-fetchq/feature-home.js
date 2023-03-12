const homeRouteHandler = (request, reply) => {
  request.log('[home] route');
  reply.send('fetchq');
};

module.exports = {
  name: 'home',
  target: '$FASTIFY_ROUTE',
  handler: [{ method: 'GET', url: '/', handler: homeRouteHandler }],
};
