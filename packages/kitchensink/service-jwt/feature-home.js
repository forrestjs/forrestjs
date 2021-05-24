const signHandler = async (request) => request.jwt.sign(request.params.payload);
const verifyHandler = async (request) =>
  request.jwt.verify(request.body.signed);

module.exports = {
  name: 'home',
  hook: '$FASTIFY_ROUTE',
  handler: [
    {
      method: 'GET',
      url: '/jwt/sign/:payload',
      handler: signHandler,
    },
    {
      method: 'POST',
      url: '/jwt/verify',
      handler: verifyHandler,
    },
  ],
};
