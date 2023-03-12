const testFn = require("./reduce-spread-array-field");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("reduce-spread-array-field", () => {
      it("Should spread a sub-array", () => {
        const res = [{ foo: ["a", "b"] }, { foo: ["c", "d"] }].reduce(
          testFn("foo"),
          []
        );

        expect(res).toEqual(["a", "b", "c", "d"]);
      });
    });
  });
});
