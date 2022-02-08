/**
 * Home Page
 * Uses the `service-env` to expose a configuration that is
 * provided to the app as an environmental variable.
 */

const getGithubUser = async (request) => {
  const uname = request.query.uname || 'marcopeg';
  const res = await request.axios.get(`https://api.github.com/users/${uname}`);
  return `${res.data.login}, aka: ${res.data.name}`;
};

module.exports = {
  name: 'githubUser',
  target: '$FASTIFY_ROUTE',
  handler: { method: 'GET', url: '/', handler: getGithubUser },
};
