class HasuraQueryError extends Error {
  constructor(message, query, variables, endpoint, token) {
    super(message);
    this.name = "HasuraQueryError";
    this.message = message;
    this.query = query;
    this.variables = variables;
    this.endpoint = endpoint;
    this.token = token;
  }
}

class HasuraQueryRequestError extends HasuraQueryError {
  constructor(message, query, variables, endpoint, token, error) {
    super(message, query, variables, endpoint, token);
    this.name = "HasuraQueryRequestError";
    this.originalError = error;
  }
}

class HasuraQueryResponseError extends HasuraQueryError {
  constructor(message, query, variables, endpoint, token, response) {
    super(message, query, variables, endpoint, token);
    this.name = "HasuraQueryResponseError";
    this.response = response;
  }
}

module.exports = {
  HasuraQueryError,
  HasuraQueryRequestError,
  HasuraQueryResponseError
};
