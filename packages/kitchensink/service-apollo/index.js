const forrestjs = require('@forrestjs/hooks');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceApollo = require('@forrestjs/service-apollo');
const gql = require('graphql-tag');

const homePage = () => ({
  hook: '$FASTIFY_GET',
  handler: {
    url: '/',
    handler: (request) =>
      request.apollo.query({
        query: gql`
          query countries {
            countries {
              code
              name
            }
          }
        `,
      }),
  },
});

forrestjs({
  trace: 'compact',
  settings: {
    apollo: {
      client: {
        config: {
          uri: `https://countries.trevorblades.com/`,
        },
      },
    },
  },
  services: [serviceApollo, serviceFastify],
  features: [homePage],
}).catch((err) => console.error(err));
