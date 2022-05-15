module.exports = {
  name: 'hash',
  target: '$FASTIFY_ROUTE',
  handler: {
    method: 'GET',
    url: '/hash/encode/:input',
    handler: async (request) => request.hash.encode(request.params.input),
  },
};
