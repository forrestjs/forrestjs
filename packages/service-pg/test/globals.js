module.exports = (global) => {
  const query = (q, p) => global.testPost('/pg/query', { q, p });

  return {
    pg: {
      query,
    },
  };
};
