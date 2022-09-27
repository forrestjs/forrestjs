const testFn = require("./reduce-source-map");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("reduce-source-map", () => {
      it("Should reduce corrrectly", () => {
        const res = [
          { name: "foo", id: 1 },
          { name: "bar", id: 2 }
        ].reduce(testFn, {});

        expect(res).toEqual({
          foo: { name: "foo", id: 1 },
          bar: { name: "bar", id: 2 }
        });
      });

      it("Should throw in case of duplication", () => {
        const fn = jest.fn();
        try {
          const res = [
            { name: "foo", id: 1 },
            { name: "bar", id: 2 },
            { name: "bar", id: 2 }
          ].reduce(testFn, {});
        } catch (err) {
          fn(err);
        }

        expect(fn.mock.calls.length).toBe(1);
        expect(fn.mock.calls[0][0].conflictOn).toBe("bar");
      });
    });
  });
});
