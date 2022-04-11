class HasuraClaims {
  constructor() {
    this.claims = [];
  }

  push(key, val) {
    this.claims.push([key, val]);
  }

  serialize() {
    return this.claims.reduce(
      (acc, curr) => ({
        ...acc,
        [`x-hasura-${curr[0]}`]: curr[1]
      }),
      {}
    );
  }

  reset() {
    this.claims = [];
  }
}

module.exports = HasuraClaims;
