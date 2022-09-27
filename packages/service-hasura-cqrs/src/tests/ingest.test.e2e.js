const populateSuccessfulCommands = (tot) => `
INSERT INTO "cqrs".todos_commands ("tenant_id", "cmd_name", "payload")
SELECT
	CONCAT('t-', floor(random() * 10 + 1)::int) as "tenant_id",
	'create' as "cmd_name",
	CONCAT('{"title":"', "id", '"}')::json AS "payload"
FROM generate_series(1, ${tot}) "id";
`;

const populateFailingCommands = (tot) => `
INSERT INTO "cqrs".todos_commands ("tenant_id", "cmd_name", "payload")
SELECT
	CONCAT('t-', floor(random() * 10 + 1)::int) as "tenant_id",
	'foobar' as "cmd_name",
	CONCAT('{"title":"', "id", '"}')::json AS "payload"
FROM generate_series(1, ${tot}) "id";
`;

describe("HasuraCQRS", () => {
  beforeEach(async () => {
    await global.reset();
    await global.hasura.sql(`TRUNCATE cqrs.todos_commands CASCADE`);
    await global.hasura.sql(`TRUNCATE cqrs.todos_responses CASCADE`);
    await global.hasura.sql(`TRUNCATE todos.entries_log CASCADE`);
    await global.hasura.sql(`TRUNCATE todos_public.entries CASCADE`);

    // Truncate Fetchq data
    const queues = await global.hasura.sql(`SELECT name FROM fetchq.queues`);
    for (const queue of queues) {
      if (["task"].includes(queue.name)) {
        continue;
      }
      await global.hasura.sql(
        `select * from fetchq.queue_truncate('${queue.name}', false)`
      );
    }
  });

  describe("ingest", () => {
    it("should ingest commands", async () => {
      // await global.hasura.sql(populateSuccessfulCommands(1));
      // await global.hasura.sql(populateFailingCommands(1));
      // await global.fetchq.lazyQuery(
      //   `SELECT subject FROM fetchq_data.commands__docs`,
      //   {
      //     test: (res) => res.rows.length >= 1
      //   }
      // );
    });
  });
});
