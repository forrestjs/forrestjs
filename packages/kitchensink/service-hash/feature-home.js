const encodeHandler = async (request) =>
  request.hash.encode(request.params.input);

const compareHandler = async (request) =>
  request.hash.compare(request.body.input, request.body.hash);

module.exports = {
  name: 'home',
  target: '$FASTIFY_ROUTE',
  handler: [
    {
      method: 'GET',
      url: '/encode/:input',
      handler: encodeHandler,
    },
    {
      method: 'POST',
      url: '/compare',
      handler: compareHandler,
    },
  ],
};
