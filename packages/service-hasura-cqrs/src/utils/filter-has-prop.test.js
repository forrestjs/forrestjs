const testFn = require("./filter-has-prop");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("filter-has-prop", () => {
      it("Should be positive if given the prop", () => {
        const res = testFn(
          "foo",
          "bar"
        )({
          foo: "bar"
        });

        expect(res).toBe(true);
      });

      it("Should be positive if given only the prop", () => {
        const res = testFn("foo")({
          foo: "bar"
        });

        expect(res).toBe(true);
      });

      it("Should be negative if the prop does not exist", () => {
        const res = testFn("hoho")({
          foo: "bar"
        });

        expect(res).toBe(false);
      });

      it("Should be negative if the prop has a different vale", () => {
        const res = testFn(
          "foo",
          "hoho"
        )({
          foo: "bar"
        });

        expect(res).toBe(false);
      });

      it("Should be negative if the input is not an object", () => {
        expect(testFn("foo", "hoho")("not an object")).toBe(false);
        expect(testFn("foo", "hoho")(true)).toBe(false);
        expect(testFn("foo", "hoho")(false)).toBe(false);
        expect(testFn("foo", "hoho")(null)).toBe(false);
        expect(testFn("foo", "hoho")(undefined)).toBe(false);
        expect(testFn("foo", "hoho")(NaN)).toBe(false);
        expect(testFn("foo", "hoho")(Infinity)).toBe(false);
        expect(testFn("foo", "hoho")(123)).toBe(false);
        expect(testFn("foo", "hoho")(["a"])).toBe(false);
        expect(testFn("foo", "hoho")("")).toBe(false);
      });
    });
  });
});
