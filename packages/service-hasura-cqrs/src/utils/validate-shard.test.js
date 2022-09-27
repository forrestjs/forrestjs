const testFn = require("./validate-shard");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("validate-shard", () => {
      it("Should validate a correct payload", () => {
        const fn = () => {};

        const res = testFn({
          source: "todo",
          targets: ["ingest"],
          router: fn,
          checkOnBoot: false,
          dropOnComplete: false,
          workerSettings: { batch: 1 },
          shouldLog: false
        });

        expect(res).toEqual({
          source: "todo",
          targets: ["ingest"],
          router: fn,
          checkOnBoot: false,
          dropOnComplete: false,
          workerSettings: { batch: 1 },
          shouldLog: false
        });
      });

      // it(`Should fail without "source"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({});
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail without "shards"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ source: "foo" });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail without "shard"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ source: "foo", shards: ["foo"] });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail with empty "shards"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ source: "foo", shards: [], router: () => {} });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });
    });
  });
});
