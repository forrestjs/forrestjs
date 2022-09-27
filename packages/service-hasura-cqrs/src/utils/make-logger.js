module.exports = (logger, desiredLevel) => {
  const xyzd = (
    level,
    message,
    { message: discardedMessage, ...details } = {}
  ) => {
    if (!Boolean(desiredLevel)) return;

    logger[level](message, details);
  };

  xyzd.error = (...args) => xyzd("error", ...args);
  xyzd.info = (...args) => xyzd("info", ...args);
  xyzd.verbose = (...args) => xyzd("verbose", ...args);
  xyzd.debug = (...args) => xyzd("debug", ...args);
  xyzd.silly = (...args) => xyzd("silly", ...args);

  return xyzd;
};
