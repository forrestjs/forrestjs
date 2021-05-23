const homeRouteHandler = async (request) => {
  const hash = request.getContext('hash');
  return hash.encode('foo');
};

module.exports = {
  name: 'home',
  hook: '$FASTIFY_GET',
  handler: [{ url: '/', handler: homeRouteHandler }],
};
