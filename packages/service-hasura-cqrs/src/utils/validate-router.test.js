const testFn = require("./validate-router");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("validate-router", () => {
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

      // it(`Should fail without "targets"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ source: "foo" });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail without "router"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ source: "foo", targets: ["foo"] });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail with empty "targets"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ source: "foo", targets: [], router: () => {} });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });
    });
  });
});
