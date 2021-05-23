const homeRouteHandler = async (request) => {
  const jwt = request.getContext('jwt');
  return jwt.sign({ foo: 'bar ' });
};

module.exports = {
  name: 'home',
  hook: '$FASTIFY_GET',
  handler: [{ url: '/', handler: homeRouteHandler }],
};
