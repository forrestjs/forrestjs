class ForrestJSGetConfigError extends Error {
  constructor(originalError) {
    super(`getConfig(): ${originalError.message}`);
    this.name = 'ForrestJSGetConfigError';
    this.originalError = originalError;
  }
}

class ForrestJSGetContextError extends Error {
  constructor(originalError) {
    super(`getContext(): ${originalError.message}`);
    this.name = 'ForrestJSGetContextError';
    this.originalError = originalError;
  }
}

class ForrestJSActionError extends Error {
  constructor(action, error) {
    const message =
      error && error.message
        ? error.message
        : typeof error === 'string'
        ? error
        : 'unknown error';

    super(message);
    this.name = error.name;

    // Deprecated, will be removed in v5.0.0
    this.hook = `[DEPRECATED] "err.hook" will be remove in v5.0.0\nUse "err.target" instead.\n${action.hook}`;

    // TODO: "action.hook" must change to "action.target"
    this.target = action.hook;
    this.action = action.name;

    this.trace = action.trace;
    this.originalError = error;
  }
}

// wrap a single hook error and creates a rich error type
// that contains info regarding it's logical origin
const onItemError = (error, action) => {
  throw new ForrestJSActionError(action, error);
};

module.exports = {
  ForrestJSGetConfigError,
  ForrestJSGetContextError,
  onItemError,
};
