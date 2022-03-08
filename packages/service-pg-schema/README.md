# pgSchema

Facilitates the maintenance of a simple PostgreSQL schema by running queries at boot time or in case of a TDD reset event.

> This service depends on [pg-service](https://www.npmjs.com/package/@forrestjs/service-pg).

## Configuration

### pgSchema.build

Default: `{}`

Provide configuration to the _build_ extension.

### pgSchema.seed

Default: `{}`

Provide configuration to the _seed_ extension.

### pgSchema.reset

Default: `{}`

Provide configuration to the _reset_ extension.

## Extensions

### $PG_SCHEMA_BUILD

```js
const f1 = {
  target: "$PG_SCHEMA_BUILD",
  handler: async ({ query, config }) => {
    await query("CREATE TABLE ...");
    await query("CREATE TABLE ...");
  }
};
```

### $PG_SCHEMA_SEED

```js
const f1 = {
  target: "$PG_SCHEMA_SEED",
  handler: async ({ query, config }) => {
    await query("INSERT INTO ... ON CONFLICT DO NOTHING");
    await query("INSERT INTO ... ON CONFLICT DO NOTHING");
  }
};
```

### $PG_SCHEMA_RESET

```js
const f1 = {
  target: "$PG_SCHEMA_RESET",
  handler: async ({ query, config }) => {
    await query("DROP TABLE ...");
    await query("DROP TABLE ...");
  }
};
```
