const testFn = require("./cmd-to-fetchq-push-many-doc");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("cmd-to-fetchq-push-many-doc", () => {
      it("Should map a source to a task", () => {
        const res = testFn(
          "todo",
          "cmd_id",
          "cmd_scope"
        )({
          cmd_id: "3cdfca54-f204-44b2-80b2-2797529f5f5e",
          cmd_name: "create",
          created_at: "2022-09-24T06:01:51.357619+00:00",
          payload: {
            title: "buy milk"
          },
          tenant_id: "t1"
        });

        expect(res).toEqual([
          "3cdfca54-f204-44b2-80b2-2797529f5f5e",
          0,
          {
            cmd_id: "3cdfca54-f204-44b2-80b2-2797529f5f5e",
            cmd_name: "create",
            cmd_scope: "todo",
            created_at: "2022-09-24T06:01:51.357619+00:00",
            payload: {
              title: "buy milk"
            },
            tenant_id: "t1"
          }
        ]);
      });
    });
  });
});
