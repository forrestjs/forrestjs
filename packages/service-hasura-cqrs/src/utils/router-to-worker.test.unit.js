const testFn = require("./router-to-worker");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("router-to-worker", () => {
      it("Should map a source to a task", () => {
        const fn = jest.fn();

        const res = testFn({
          batch: 10,
          handler: fn
        })({
          source: "todo"
        });

        expect(res).toEqual({
          queue: "todo",
          handler: fn,
          concurrency: 1,
          batch: 10
        });
      });
    });
  });
});
