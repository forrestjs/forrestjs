class FetchqCQRSSourceError extends Error {
  constructor(message, source) {
    super(message);
    this.name = "FetchqCQRSSourceError";
    this.conflictOn = source;
  }
}

module.exports = (acc, curr) => {
  if (acc.hasOwnProperty(curr.name)) {
    throw new FetchqCQRSSourceError(
      `Conflict rule for source: ${curr.name}`,
      curr.name
    );
  }
  return {
    ...acc,
    [curr.name]: curr
  };
};
