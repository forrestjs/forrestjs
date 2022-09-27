class FetchqCQRSRestifySourceError extends Error {
  constructor(message, source) {
    super(message);
    this.name = "FetchqCQRSRestifySourceError";
    this.conflictOn = source;
  }
}

module.exports = (acc, rule) => ({
  ...acc,
  ...rule.sources.reduce((acc1, sourceName) => {
    if (acc.hasOwnProperty(sourceName)) {
      throw new FetchqCQRSRestifySourceError(
        `Conflict rule for source: ${sourceName}`,
        sourceName
      );
    }
    return {
      ...acc1,
      [sourceName]: rule
    };
  }, {})
});
