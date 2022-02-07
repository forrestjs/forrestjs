module.exports = {
  name: 'custom-routes',
  target: '$FASTIFY_ROUTE',
  handler: [
    {
      method: 'GET',
      url: '/custom/route/:name',
      handler: async (request) => `custom: ${request.params.name}`,
    },
  ],
};
