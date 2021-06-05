const axios = require('axios');
const promiseRetry = require('promise-retry');

const BASE_URL = process.env.TEST_URL || 'http://localhost:8080';
const TEST_SCOPE = process.env.TEST_SCOPE || 'test';

// The `url()` method is used to compose urls that aim to the running app
const url = (uri = '/', baseUrl = BASE_URL) => `${baseUrl}${uri}`;

// Async way to stop the process for a while
const pause = (duration = 0) =>
  new Promise((resolve) => setTimeout(resolve, duration));

// Produces a decent console log of a JSON object
const prettify = (data) => console.info(JSON.stringify(data, null, 2));

// Utilities to pick on random stuff
const random = (min = 0, max = 10) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomItem = (items = []) => items[random(0, items.length - 1)];

// Awaits the availability of a generic uri inside the running app
const awaitAppUri = ({ uri = '/', baseUrl, delay = 250 } = {}) =>
  Promise.resolve()
    .then(() => pause(delay))
    .then(() =>
      promiseRetry((retry) => axios.get(url(uri, baseUrl)).catch(retry)),
    );

// Awaits the availability of the test's healthz endpoint
const awaitTestReady = ({ uri = `/${TEST_SCOPE}`, baseUrl, delay } = {}) =>
  awaitAppUri({ uri, baseUrl, delay });

// Wrapper around AXIOS that translates into the running app url
const http = {
  get: async (uri, config = {}) => {
    try {
      const res = await axios.get(url(uri), config);
      return res.data;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  rawGet: async (uri, config = {}) => {
    try {
      return await axios.get(url(uri), config);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  post: async (uri, data = {}, config = {}) => {
    try {
      return (await axios.post(url(uri), data, config)).data;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  rawPost: async (uri, data = {}, config = {}) => {
    try {
      return await axios.post(url(uri), data, config);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  put: async (uri, data = {}, config = {}) => {
    try {
      return (await axios.put(url(uri), data, config)).data;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  rawPut: async (uri, data = {}, config = {}) => {
    try {
      return await axios.put(url(uri), data, config);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  delete: async (uri, config = {}) => {
    try {
      return (await axios.delete(url(uri), config)).data;
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
  rawDelete: async (uri, config = {}) => {
    try {
      await axios.delete(url(uri), config);
    } catch (err) {
      console.log(err.message);
      throw err;
    }
  },
};

module.exports = (global = {}) => ({
  url,
  awaitAppUri,
  awaitTestReady,
  pause,
  prettify,
  random,
  randomItem,
  ...http,
  ...global,
});
