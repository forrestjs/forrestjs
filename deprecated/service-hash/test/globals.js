module.exports = (global) => {
  const encode = (payload) => global.post('/test/hash/encode', { payload });
  const compare = (payload, hash) =>
    global.post('/test/hash/compare', { payload, hash });
  const genSalt = (rounds = 1) => global.get(`/test/jwt/genSalt/${rounds}`);

  return {
    hash: {
      encode,
      compare,
      genSalt,
    },
  };
};
