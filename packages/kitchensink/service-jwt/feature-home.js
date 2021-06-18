const signHandler = async (request) => request.jwt.sign(request.body.payload);
const verifyHandler = async (request) =>
  request.jwt.verify(request.body.signed);

module.exports = {
  name: 'home',
  hook: '$FASTIFY_ROUTE',
  handler: [
    {
      method: 'POST',
      url: '/jwt/sign',
      handler: signHandler,
    },
    {
      method: 'POST',
      url: '/jwt/verify',
      handler: verifyHandler,
    },
  ],
};
