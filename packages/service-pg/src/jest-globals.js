module.exports = (global) => {
  const query = (q, p) => global.post('/test/pg/query', { q, p });

  return {
    pg: {
      query,
    },
  };
};
