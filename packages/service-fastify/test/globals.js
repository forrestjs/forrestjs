const axios = require('axios');
const promiseRetry = require('promise-retry');

const BASE_URL = process.env.TEST_URL || 'http://localhost:8080';
const TEST_SCOPE = process.env.TEST_SCOPE || 'test';

// The `url()` method is used to compose urls that aim to the running app
const url = (uri = '/', baseUrl = BASE_URL) => `${baseUrl}${uri}`;

// Async way to stop the process for a while
const pause = (duration = 0) =>
  new Promise((resolve) => setTimeout(resolve, duration));

// Awaits the availability of a generic uri inside the running app
const awaitAppUri = ({ uri = '/', baseUrl, delay = 250 } = {}) =>
  Promise.resolve()
    .then(() => pause(delay))
    .then(() =>
      promiseRetry((retry) =>
        axios
          .get(url(uri, baseUrl))
          .catch((err) =>
            err.message.includes('ECONNREFUSED') ? retry() : true,
          ),
      ),
    );

// Awaits the availability of the test's healthz endpoint
const awaitTestHealthz = ({
  uri = `/${TEST_SCOPE}/healthz`,
  baseUrl,
  delay,
} = {}) => awaitAppUri({ uri, baseUrl, delay });

// Wrapper around AXIOS that translates into the running app url
const http = {
  get: async (uri, config = {}) => (await axios.get(url(uri), config)).data,
  rawGet: async (uri, config = {}) => axios.get(url(uri), config),
  post: async (uri, data, config = {}) =>
    (await axios.post(url(uri), data, config)).data,
  rawPost: async (uri, data, config = {}) => axios.post(url(uri), data, config),
  put: async (uri, data, config = {}) =>
    (await axios.put(url(uri), data, config)).data,
  rawPut: async (uri, data, config = {}) => axios.put(url(uri), data, config),
  delete: async (uri, config = {}) =>
    (await axios.delete(url(uri), config)).data,
  rawDelete: async (uri, config = {}) => axios.delete(url(uri), config),
};

module.exports = {
  url,
  awaitAppUri,
  awaitTestHealthz,
  pause,
  ...http,
};
