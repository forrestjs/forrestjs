/**
 * The Home Page consumes the internal GraphQL query
 * just to test out how things may work:
 */

const axios = require('axios');

const URL = 'http://localhost:8080/graphql';
const DATA = { query: '{ping{message emotion}}' };

const homeRouteHandler = async (request, response) =>
  axios
    .post(URL, DATA)
    .then((res) => response.send(res.data.data.ping))
    .catch((err) => response.status(500).send(err.message));

module.exports = {
  hook: '$FASTIFY_GET',
  name: 'home',
  handler: {
    url: '/',
    handler: homeRouteHandler,
  },
};
