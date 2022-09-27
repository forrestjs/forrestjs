module.exports = (prop, expectedValue) => (obj) => {
  if (!obj || typeof obj !== "object") {
    return false;
  }

  if (!obj.hasOwnProperty(prop)) {
    return false;
  }

  if (expectedValue) {
    return obj[prop] === expectedValue;
  }

  return true;
};
