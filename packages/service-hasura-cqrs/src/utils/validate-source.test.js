const testFn = require("./validate-source");

describe("Hasura CQRS", () => {
  describe("utils", () => {
    describe("validate-source", () => {
      it("Should validate a correct payload", () => {
        const fn1 = jest.fn();
        const fn2 = jest.fn();
        const fn3 = jest.fn();
        const fn4 = jest.fn();
        const fn5 = jest.fn();

        const res = testFn({
          name: "todo",
          targets: ["ingest"],
          router: fn5,
          graphqlQuery: "gql query",
          buildQueryVariables: fn1,
          sleepOnEmpty: "+1m",
          sleepOnError: "+2m",
          sleepOnSuccess: "+3m",
          initialCursor: 0,
          checkOnBoot: false,
          buildSubject: fn2,
          buildNextCursor: fn3,
          buildDocument: fn4,
          shouldLog: false
        });

        expect(res).toEqual({
          name: "todo",
          targets: ["ingest"],
          router: fn5,
          graphqlQuery: "gql query",
          buildQueryVariables: fn1,
          sleepOnEmpty: "+1m",
          sleepOnError: "+2m",
          sleepOnSuccess: "+3m",
          initialCursor: "0",
          checkOnBoot: false,
          buildSubject: fn2,
          buildNextCursor: fn3,
          buildDocument: fn4,
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

      // it(`Should fail without "target"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ source: "foo" });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail without "query"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({ source: "foo", target: "foo" });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });

      // it(`Should fail with a non numeric "batch"`, () => {
      //   const fn = jest.fn();
      //   try {
      //     testFn({
      //       source: "foo",
      //       target: "foo",
      //       query: "query Foo {}",
      //       batch: "a"
      //     });
      //   } catch (err) {
      //     fn(err);
      //   }

      //   expect(fn.mock.calls.length).toBe(1);
      // });
    });
  });
});
