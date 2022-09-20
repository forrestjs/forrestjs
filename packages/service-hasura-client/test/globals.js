module.exports = (global) => {
  return {
    hasura: {
      query: async (query, variables) => {
        const res = await global.testPost("/hasura/query", {
          query,
          variables
        });

        return res.data;
      },
      sql: async (sql, source) => {
        const res = await global.testPost("/hasura/sql", {
          sql,
          source
        });

        return res.data;
      }
    }
  };
};
