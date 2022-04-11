module.exports = (global) => {
  const sign = (payload) => global.testPost('/jwt/sign', { payload });
  const verify = (jwt) => global.testPost('/jwt/verify', { jwt });
  const decode = (jwt) => global.testPost('/jwt/decode', { jwt });

  return {
    jwt: {
      sign,
      verify,
      decode,
    },
  };
};
