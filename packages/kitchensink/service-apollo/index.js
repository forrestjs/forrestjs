const forrestjs = require('@forrestjs/core');
const serviceFastify = require('@forrestjs/service-fastify');
const serviceApollo = require('@forrestjs/service-apollo');
const gql = require('graphql-tag');

const GET_COUNTRIES = gql`
  query countries {
    countries {
      code
      name
    }
  }
`;

const homePage = () => ({
  target: '$FASTIFY_ROUTE',
  handler: {
    method: 'GET',
    url: '/',
    handler: (request) =>
      request.apollo.query(
        {
          query: GET_COUNTRIES,
        },
        {
          fetchPolicy: 'network-only',
        },
      ),
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
  services: [serviceFastify, serviceApollo],
  features: [homePage],
}).catch((err) => console.error(err));
