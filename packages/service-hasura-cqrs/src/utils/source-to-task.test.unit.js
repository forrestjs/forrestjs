const testFn = require("./source-to-task");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("source-to-task", () => {
      it("Should map a source to a task", () => {
        const res = testFn({
          resetOnBoot: true
        })({
          name: "todo",
          query: "gql query",
          batch: 2,
          initialCursor: "1970-01-01"
        });

        expect(res).toEqual({
          subject: "fetchq-cqrs-todo",
          payload: {
            source: "todo",
            cursor: "1970-01-01"
          },
          resetOnBoot: true
        });
      });
    });
  });
});
