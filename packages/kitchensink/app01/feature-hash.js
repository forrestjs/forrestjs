module.exports = {
  name: 'hash',
  hook: '$FASTIFY_GET',
  handler: {
    url: '/hash/encode/:input',
    handler: async (request) => request.hash.encode(request.params.input),
  },
};
