const homeRouteHandler = async (request) => request.jwt.sign({ foo: 'bar ' });

module.exports = {
  name: 'home',
  hook: '$FASTIFY_GET?',
  handler: [{ url: '/', handler: homeRouteHandler }],
};
