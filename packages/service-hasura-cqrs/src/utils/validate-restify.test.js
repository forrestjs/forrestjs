const testFn = require("./validate-restify");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("validate-restify", () => {
      it("Should validate a correct payload", () => {
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        const fn3 = jest.fn();
        const fn4 = jest.fn();

        const res = testFn({
          sources: ["todo"],
          endpoint: "http://localhost",
          headers: {},
          checkOnBoot: false,
          dropOnComplete: false,
          workerSettings: { batch: 2 },
          graphqlQuery: "query {}",
          buildQueryVariables: fn1,
          shouldSendResponse: fn2,
          shouldSendError: fn4,
          buildRequestBody: fn3,
          shouldLog: false
        });

        expect(res).toEqual({
          sources: ["todo"],
          endpoint: "http://localhost",
          headers: {},
          checkOnBoot: false,
          dropOnComplete: false,
          workerSettings: { batch: 2 },
          graphqlQuery: "query {}",
          buildQueryVariables: fn1,
          shouldSendResponse: fn2,
          shouldSendError: fn4,
          buildRequestBody: fn3,
          shouldLog: false
        });
      });

      // it(`Should fail without "sources"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({});
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail with empty "sources"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ sources: [] });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail with non array "sources"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ sources: "todos" });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail without "endpoint"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ sources: ["foo"] });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail with an empty "endpoint"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ sources: ["foo"], endpoint: "" });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail with non-object "headers"`, () => {
      //   const fn = jest.fn();

      //   try {
      //     testFn({
      //       sources: ["foo"],
      //       endpoint: "http://localhost",
      //       headers: ""
      //     });
      //   } catch (err) {
      //     fn(err);
      //   }
      //   try {
      //     testFn({
      //       sources: ["foo"],
      //       endpoint: "http://localhost",
      //       headers: 23
      //     });
      //   } catch (err) {
      //     fn(err);
      //   }
      //   try {
      //     testFn({
      //       sources: ["foo"],
      //       endpoint: "http://localhost",
      //       headers: true
      //     });
      //   } catch (err) {
      //     fn(err);
      //   }
      //   try {
      //     testFn({
      //       sources: ["foo"],
      //       endpoint: "http://localhost",
      //       headers: false
      //     });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(4);
      // });

      // it(`Should fail without "graphql`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({
      //       sources: ["foo"],
      //       endpoint: "http://",
      //       headers: () => {}
      //     });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });
    });
  });
});
