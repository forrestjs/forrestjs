class ForrestJSGetConfigError extends Error {
  constructor(message) {
    super(`getConfig(): ${message}`);
    this.name = 'ForrestJSGetConfigError';
  }
}

class ForrestJSGetContextError extends Error {
  constructor(message) {
    super(`getContext(): ${message}`);
    this.name = 'ForrestJSGetContextError';
  }
}

class ForrestJSUnknownTargetError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForrestJSUnknownTargetError';
  }
}

class ForrestJSCreateExtensionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForrestJSCreateExtensionError';
  }
}

class ForrestJSRegisterActionError extends Error {
  constructor(message, props) {
    super(message);
    this.name = 'ForrestJSRegisterActionError';
    this.target = props.target;
    this.action = props.name;
    this.trace = props.trace;
  }
}

class ForrestJSRunExtensionError extends Error {
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
  throw new ForrestJSRunExtensionError(action, error);
};

module.exports = {
  ForrestJSGetConfigError,
  ForrestJSGetContextError,
  ForrestJSUnknownTargetError,
  ForrestJSCreateExtensionError,
  ForrestJSRegisterActionError,
  onItemError,
};
