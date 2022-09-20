class HasuraSQLError extends Error {
  constructor(message, endpoint, secret, source, sql, originalError) {
    super(message);
    this.name = "HasuraSQLError";
    this.endpoint = endpoint;
    this.secret = secret;
    this.source = source;
    this.sql = sql;
    this.originalError = originalError;
  }
}

const getSQLErrorMessage = (data) => {
  if (data.code === "postgres-error") {
    return `${data.error}: ${data.internal.error.message}`;
  }

  return error.message;
};

class HasuraSQLPostgresError extends HasuraSQLError {
  constructor(error, endpoint, secret, source, sql) {
    super(
      getSQLErrorMessage(error.response.data),
      endpoint,
      secret,
      source,
      sql,
      error
    );
    this.name = "HasuraSQLPostgresError";
  }
}

class HasuraSQLRequestError extends HasuraSQLError {
  constructor(error, endpoint, secret, source, sql) {
    super("Unknown GraphQL response", endpoint, secret, source, sql, error);
    this.name = "HasuraSQLRequestError";
  }
}

module.exports = {
  HasuraSQLError,
  HasuraSQLPostgresError,
  HasuraSQLRequestError
};
