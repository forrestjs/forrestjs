class FetchqCQRSRestifyError extends Error {
  constructor(message) {
    super(message);
    this.name = "FetchqCQRSRestifyError";
  }
}

module.exports = ({
  sources, // List of queues to whom associate the REST worker
  endpoint, // Should be a string, could be a function
  headers = {}, // Should be an object, could be a function
  checkOnBoot = true,
  dropOnComplete = true,
  workerSettings = {},
  graphqlQuery, // graphql query + variables
  buildQueryVariables,
  shouldSendResponse = () => true,
  shouldSendError = () => true,
  buildRequestBody = (data) => data,
  shouldLog = true
} = {}) => {
  if (!sources || sources === "") {
    throw new FetchqCQRSRestifyError("Missing property: sources");
  }
  if (!Array.isArray(sources)) {
    throw new FetchqCQRSRestifyError("Missing property: sources");
  }
  if (!sources.length) {
    throw new FetchqCQRSRestifyError("A router needs at least one source");
  }
  if (!endpoint || (typeof endpoint === "string" && !endpoint.length)) {
    throw new FetchqCQRSRestifyError("Missing property: endpoint");
  }
  if (!["string", "function"].includes(typeof endpoint)) {
    throw new FetchqCQRSRestifyError(
      "Invalid endpoint, it should be an URL or a Function"
    );
  }
  if (!["object", "function"].includes(typeof headers)) {
    throw new FetchqCQRSRestifyError(
      "Invalid eaders, it should be an Object or a Function"
    );
  }

  // if (!graphqlQuery || !graphqlQuery.length) {
  //   throw new FetchqCQRSRestifyError("Missing property: graphqlQuery");
  // }
  // if (!buildQueryVariables) {
  //   throw new FetchqCQRSRestifyError("Missing property: buildQueryVariables");
  // }
  // if (typeof buildQueryVariables !== "function") {
  //   throw new FetchqCQRSRestifyError(
  //     "Malformed property: buildQueryVariables"
  //   );
  // }

  return {
    sources,
    endpoint,
    headers,
    checkOnBoot: Boolean(checkOnBoot),
    dropOnComplete: Boolean(dropOnComplete),
    workerSettings,
    shouldSendResponse,
    shouldSendError,
    graphqlQuery,
    buildQueryVariables,
    buildRequestBody,
    shouldLog
  };
};
