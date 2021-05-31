module.exports = (global) => {
  const sign = (payload) => global.post('/test/jwt/sign', { payload });
  const verify = (jwt) => global.post('/test/jwt/verify', { jwt });
  const decode = (jwt) => global.post('/test/jwt/decode', { jwt });

  return {
    jwt: {
      sign,
      verify,
      decode,
    },
  };
};
