<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Schema & Data Seeding</h1>

[My First Feature](../README.md) &raquo; [Schema & Data Seeding](./README.md)

---

# Schema & Data Seeding

We've reached a point in this tutorial in which **we can enjoy a stable connection towards a PostgreSQL** instance, and a way for any Feature to tap into the moment that connection becomes available **and run custom queries**.

> What's the basic need that we can solve with this power?

**Well, we could seed our Feature's data structure and initial data.**

Ok, now you're arguing that **migrations** exist exactly to solve this issue, and I fully agree with you. But if you don't mind, just bear with me with an open mind and **consider to this simple alternative**.

Create a `/users/seed.js` module:

```js
module.exports = async ({ query }) => {
  // Create the necessary data structure
  await query(`
    CREATE TABLE IF NOT EXISTS "public"."users" (
      "name" VARCHAR(255) PRIMARY KEY
    );
  `);

  // Seed the necessary initial data
  await query(`
    INSERT INTO "public"."users" ("name") 
    VALUES ('Luke Skywalker'), ('Ian Solo')
    ON CONFLICT ON CONSTRAINT "users_pkey"
    DO NOTHING;
  `);
};
```

Then just use this module as handler for the `PG_READY` hook in `/users/index.js`:

```js
const seedUsers = require('./seed');

const usersFeature = ({ registerAction }) => {
  // ... register other actions ...

  registerAction({
    hook: '$PG_READY',
    handler: seedUsers,
  });
};

module.exports = usersFeature;
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/070-schema-and-data-seeding-byqcy?file=/src/users/seed.js

---

## Idempotent Queries for Microservices

It is so cool to talk about **microservices** nowadays, everybody want to talk about it and offer a million different approaches.

I'm a big fan myself.

> But what does really make a microservice "micro"?

My answer is: **a correct implementation of the Single Responsibility Principle**.  
One service serves one purpose only, and it is unentangled by the rest of the system.

In my experience working with microservices, the schemas they need to maintain is simple enough to sustain an **idempotent and declarative evolution of the schema** as shown in this small example.

The **Users Feature** needs a very simple schema, and **that schema can be upserted at boot time** over and over, by one ore more concurrent processes, without breaking it. Same goes for the data.

My service could be composed by multiple features, and by treating each one as an isolated and unentangled "microservice" it becomes possible to upsert their schema without an external migration service.

### Pros:

- Creates the schema and seeds at boot time, effectively simplifying the developer's life
- Transparent to horizontal scalability as every instruction must be idempotent
- Simple to document and execute: **just run the app**

### Cons:

- The seed file may become messy if the schema changes a lot or in a lot of details
- The whole schema is distributed into each Feature's source code
- Feature declare separated portion of a schema, but then they **may be co-dependent** in using it (eg. joins)
