const axios = require('axios');
const promiseRetry = require('promise-retry');

const BASE_URL = process.env.TEST_URL || 'http://localhost:8080';
const TEST_SCOPE = process.env.TEST_SCOPE || 'test';

// The `url()` method is used to compose urls that aim to the running app
const url = (uri = '/', baseUrl = BASE_URL) => `${baseUrl}${uri}`;
const testUrl = (uri = '/', baseUrl = `${BASE_URL}/${TEST_SCOPE}`) =>
  uri === '/' ? baseUrl : `${baseUrl}${uri}`;

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
const awaitAppUri = ({ uri = '/', baseUrl, delay = 250, log = false } = {}) =>
  Promise.resolve()
    .then(() => pause(delay))
    .then(() =>
      promiseRetry((retry) =>
        axios.get(url(uri, baseUrl)).catch((err) => {
          log && console.log(`Not ready yet: ${err.request.res.responseUrl}`);
          return retry();
        }),
      ),
    );

// Awaits the availability of the test's healthz endpoint
const awaitTestReady = ({ uri = `/${TEST_SCOPE}`, baseUrl, delay } = {}) =>
  awaitAppUri({ uri, baseUrl, delay, log: true });

/**
 * =================
 * TEST HTTP LIBRARY
 * =================
 *
 * The test HTTP library is an Axios wrapper that provides some
 * automation in building the urls towards the tested App or the
 * TDD endpoints.
 *
 * Usage:
 *
 * -- Get a request's data:
 * await global.get('/foobar')
 * await global.post('/foobar')
 * await global.post('/foobar', { body: 'data' })
 *
 * -- Get the raw Axios object:
 * await global.rawGet('/foobar')
 * await global.rawPost('/foobar')
 * await global.rawPost('/foobar', { body: 'data' })
 */

class AxiosRequestFailed extends Error {
  constructor(method, url, args, originalError) {
    super();
    this.request = { method, url, args };
    this.originalError = originalError;
    this.message = `Axios.${method}(${url})\n${this.getMessage()}`;
    this.response = originalError.response;
    this.logMessage();
  }

  getMessage() {
    const err = this.originalError;
    if (err.response && err.response.data && err.response.data.message) {
      return `[${err.response.data.status || err.response.status}] ${
        err.response.data.message
      }`;
    }

    if (err.response) {
      return `[${err.response.status}] ${err.response.statusText}`;
    }

    return err.message;
  }

  logMessage() {
    const err = this.originalError;
    console.log(`[axios] error ... ${err.message}`);
    console.log(`[axios] url ..... ${this.request.url}`);
    console.log(`[axios] method .. ${this.request.method}`);
    this.request.args.length &&
      console.log(
        `[axios] args .... ${JSON.parse(
          JSON.stringify(this.request.args),
          null,
          2,
        )}`,
      );
    if (err.response) {
      console.log(`[axios] status .. ${err.response.status}`);
      console.log(`[axios] text .... ${err.response.statusText}`);
      console.log(`[axios] data:`);
      console.log(JSON.parse(JSON.stringify(err.response.data), null, 2));
    }
  }
}

const makeAxiosRequest = (method, buildUrl, raw = false) => {
  const handler = axios[method];

  // Automatically defaults a request body to an empty object
  // for requests that are not GET.
  const fn = async (...args) => {
    if (method === 'get') {
      const [uri, ...rest] = args;
      const requestUrl = buildUrl(uri);
      const res = await handler(requestUrl, ...rest);
      return raw ? res : res.data;
    } else {
      const [uri, body = {}, ...rest] = args;
      const requestUrl = buildUrl(uri);
      const res = await handler(requestUrl, body, ...rest);
      return raw ? res : res.data;
    }
  };

  // Automatically defaults a request body to an empty object
  // for requests that are not GET.
  fn.debug = async (...args) => {
    if (method === 'get') {
      const [uri, ...rest] = args;
      const requestUrl = buildUrl(uri);
      try {
        const res = await handler(requestUrl, ...rest);
        return raw ? res : res.data;
      } catch (err) {
        throw new AxiosRequestFailed(method, requestUrl, rest, err);
      }
    } else {
      const [uri, body = {}, ...rest] = args;
      const requestUrl = buildUrl(uri);
      try {
        const res = await handler(requestUrl, body, ...rest);
        return raw ? res : res.data;
      } catch (err) {
        throw new AxiosRequestFailed(method, requestUrl, rest, err);
      }
    }
  };

  return fn;
};

// Wrapper around AXIOS that translates into the running app url
const http = {
  // Production API
  get: makeAxiosRequest('get', url),
  rawGet: makeAxiosRequest('get', url, true),
  post: makeAxiosRequest('post', url),
  rawPost: makeAxiosRequest('post', url, true),
  put: makeAxiosRequest('put', url),
  rawPut: makeAxiosRequest('put', url, true),
  delete: makeAxiosRequest('delete', url),
  rawDelete: makeAxiosRequest('delete', url, true),
  // Test API
  testGet: makeAxiosRequest('get', testUrl),
  testRawGet: makeAxiosRequest('get', testUrl, true),
  testPost: makeAxiosRequest('post', testUrl),
  testRawPost: makeAxiosRequest('post', testUrl, true),
  testPut: makeAxiosRequest('put', testUrl),
  testRawPut: makeAxiosRequest('put', testUrl, true),
  testDelete: makeAxiosRequest('delete', testUrl),
  testRawDelete: makeAxiosRequest('delete', testUrl, true),
};

const getConfig = (key, defaultValue) =>
  http.testGet(
    `/config?key=${key}${defaultValue ? `&default=${defaultValue}` : ''}`,
  );

const setConfig = (key, value) => http.testPost(`/config`, { key, value });

/**
 * ===============
 * CONFIG MOCK API
 * ===============
 *
 * Offers an easy API to temporary mock an App's
 * configuration value.
 *
 * -- Set a mock:
 * const reset = await global.mockConfig('key', 'newValue')
 * ... do your stuff
 * await reset()
 *
 * -- Reset all existing mocks:
 *    (useful in "afterEach")
 * await mockConfig.reset()
 *
 */
const mockConfig = async (key = null, value = null) => {
  const original = await http.testGet(`/config?key=${key}`);
  const current = await http.testPost(`/config`, { key, value });

  const resetMock = () =>
    http.testPost(`/config`, { key, value: original.value });
  mockConfig.__mocks.push(resetMock);

  resetMock.original = original;
  resetMock.current = current;

  return resetMock;
};

mockConfig.__mocks = [];
mockConfig.reset = async () => {
  await Promise.all(mockConfig.__mocks.map((resetFn) => resetFn()));
  mockConfig.__mocks = [];
};

const reset = () => http.testGet('/reset');

const mockAxios = (...args) => {
  if (args.length === 3) {
    const [method, url, response] = args;
    return http.testPost('/axios/stubs', { method, url, response });
  }

  const [url, response] = args;
  return http.testPost('/axios/stubs', { url, response });
};
mockAxios.reset = () => http.testDelete('/axios/stubs');

module.exports = (global = {}) => ({
  url,
  testUrl,
  awaitAppUri,
  awaitTestReady,
  pause,
  prettify,
  random,
  randomItem,
  ...http,
  reset,
  setConfig,
  getConfig,
  mockConfig,
  mockAxios,
  ...global,
});
