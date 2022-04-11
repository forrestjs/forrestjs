const HasuraClaims = require("./hasura-claims.class");

const runValidate = async (validate, request, reply) => {
  if (validate) {
    try {
      for (const fn of validate) {
        await fn(request);
      }
    } catch (err) {
      reply.status(401).send(err.message);
    }
  }

  return request.hasuraClaims.serialize();
};

module.exports = async (
  fastify,
  { enableGet, enablePost, getHooks, postHooks, createExtension }
) => {
  fastify.decorateRequest("hasuraClaims", null);
  fastify.addHook("onRequest", async (request) => {
    request.hasuraClaims = new HasuraClaims();
  });

  // Let exend local Fastify context
  createExtension.sync("$HASURA_AUTH_FASTIFY", { fastify });

  if (enableGet) {
    const { validate, ...configRoute } = getHooks;

    fastify.route({
      url: "/",
      ...configRoute,
      method: "GET",
      handler: (request, reply) => runValidate(validate, request, reply)
    });
  }

  if (enablePost) {
    const { validate, ...configRoute } = postHooks;

    fastify.route({
      url: "/",
      ...configRoute,
      method: "POST",
      handler: (request, reply) => runValidate(validate, request, reply)
    });
  }
};
