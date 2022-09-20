const axios = require("axios");

const {
  HasuraQueryError,
  HasuraQueryRequestError,
  HasuraQueryResponseError
} = require("./errors-query");

const {
  HasuraSQLError,
  HasuraSQLPostgresError,
  HasuraSQLRequestError
} = require("./errors-sql");

class HasuraClient {
  constructor(endpoint, config) {
    this.endpoint = endpoint;
    this.token = config.token;
    this.secret = config.secret;

    this.url = {
      query: [this.endpoint, "v1", "graphql"].join("/"),
      sql: [this.endpoint, "v2", "query"].join("/")
    };
  }

  async query(query, variables = {}) {
    try {
      const res = await axios.request({
        url: this.url.query,
        method: "post",
        data: {
          query,
          variables
        },
        headers: {
          ...(this.token ? { Authorization: `Bearer ${this.token}` } : {})
        }
      });

      if (res.data.data) {
        return res.data.data;
      }

      if (res.data.errors) {
        throw new HasuraQueryResponseError(
          res.data.errors[0].message,
          query,
          variables,
          this.endpoint,
          this.token,
          res
        );
      }

      throw new HasuraQueryResponseError(
        "Unknown GraphQL response",
        query,
        variables,
        this.endpoint,
        this.token,
        res
      );
    } catch (err) {
      if (err instanceof HasuraQueryError) {
        throw err;
      }

      throw new HasuraQueryRequestError(
        err.message,
        query,
        variables,
        this.endpoint,
        this.token,
        err
      );
    }
  }

  async sql(sql, source = "default") {
    try {
      const res = await axios.request({
        url: this.url.sql,
        method: "post",
        data: {
          type: "run_sql",
          args: {
            source,
            sql
          }
        },
        headers: {
          ...(this.secret ? { "x-hasura-admin-secret": this.secret } : {})
        }
      });

      if (res.data.result_type && res.data.result_type === "CommandOk") {
        return res.data.result;
      }

      // Map tuples into an array of lines object:
      if (res.data.result_type && res.data.result_type === "TuplesOk") {
        const columns = res.data.result.shift();
        return res.data.result.reduce(
          (acc, data) => [
            ...acc,
            columns.reduce(
              (acc, curr, idx) => ({
                ...acc,
                [curr]: data[idx]
              }),
              {}
            )
          ],
          []
        );
      }

      throw new HasuraSQLRequestError(
        err,
        source,
        sql,
        this.endpoint,
        this.secret
      );
    } catch (err) {
      // Catch an explicitly set error
      if (err instanceof HasuraSQLError) {
        throw err;
      }

      // Catch an error from Hasura
      if (
        err.response &&
        err.response.status === 400 &&
        err.response.data &&
        err.response.data.code
      ) {
        throw new HasuraSQLPostgresError(
          err,
          source,
          sql,
          this.endpoint,
          this.secret
        );
      }

      throw new HasuraSQLRequestError(
        err,
        source,
        sql,
        this.endpoint,
        this.secret
      );
    }
  }
}

module.exports = { HasuraClient };
