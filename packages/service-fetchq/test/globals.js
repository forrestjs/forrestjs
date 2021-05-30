module.exports = (global) => {
  const query = (q) => global.post('/test/fetchq/query', { q });

  const getDocument = (queue, subject) =>
    global.get(`/test/fetchq/${queue}/${subject}`);

  const awaitDocument = (queue, subject, options = {}) =>
    global.post(`/test/fetchq/await/${queue}/${subject}`, options);

  const lazyQuery = (
    sql,
    {
      test = (res) => res.rows.length > 0,
      timeout = 1000,
      interval = 100,
    } = {},
  ) =>
    new Promise((resolve, reject) => {
      let timer = null;

      const timebox = setTimeout(() => {
        clearTimeout(timer);
        reject(new Error('timeout'));
      }, timeout);

      const loop = async () => {
        try {
          const res = await query(sql);
          if (test(res)) {
            clearTimeout(timebox);
            resolve(res);
          } else {
            timer = setTimeout(loop, interval);
          }
        } catch (err) {
          reject(err);
        }
      };

      loop();
    });

  const resetState = () => global.get('/test/fetchq/state/reset');

  return {
    fetchq: {
      query,
      getDocument,
      awaitDocument,
      lazyQuery,
      resetState,
    },
  };
};
