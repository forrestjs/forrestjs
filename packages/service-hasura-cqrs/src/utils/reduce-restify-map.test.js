const testFn = require("./reduce-restify-map");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("reduce-restify-map", () => {
      it("Should reduce corrrectly", () => {
        const res = [
          { id: 1, sources: ["a"] },
          { id: 2, sources: ["b", "c"] }
        ].reduce(testFn, {});

        expect(res).toEqual({
          a: { id: 1, sources: ["a"] },
          b: { id: 2, sources: ["b", "c"] },
          c: { id: 2, sources: ["b", "c"] }
        });
      });

      it("Should throw in case of duplication", () => {
        const fn = jest.fn();
        try {
          const res = [
            { id: 1, sources: ["a", "b"] },
            { id: 2, sources: ["b", "c"] }
          ].reduce(testFn, {});
        } catch (err) {
          fn(err);
        }

        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0].conflictOn).toBe("b");
      });
    });
  });
});
