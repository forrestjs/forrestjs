/**
 * Home Page
 * Uses the `service-env` to expose a configuration that is
 * provided to the app as an environmental variable.
 */

const getJokes = async (request) => {
  const res = await request.axios.get(
    'https://official-joke-api.appspot.com/jokes/ten',
  );
  const joke = res.data[0];
  return `${joke.setup}\n${joke.punchline}`;
};

const jokes = ({ registerAction }) => {
  registerAction({
    hook: '$FASTIFY_ROUTE',
    handler: { method: 'GET', url: '/', handler: getJokes },
  });
};

module.exports = jokes;
