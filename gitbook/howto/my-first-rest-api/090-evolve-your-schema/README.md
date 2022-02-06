<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Evolve Your Schema</h1>

[My First Feature](../README.md) &raquo; [Evolve Your Schema](./README.md)

---

# Evolve Your Schema

We are running all these examples on a **shared free database** and, as in every free stuff, resources are very limited.

👉 In order to keep data at minimum, it would be nice to cleanup user produced data some now and then.

Therefore, I'd like to introduce a "user story" such as:

> _The App should **drop users older than 10 minutes** before seeding._

## Evolving The Schema

The first step into fulfilling the "older than xx" requirement is to keep track of when a given user was first created.

The easiest way to achieve this would be to add a `created_at` column where to store such value:

```js
await query(`
  ALTER TABLE "public"."users" 
  ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now();
`);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/090-evolve-your-schema-5dlm5?file=/src/users/seed.js:352-543

---

The most important part is **`IF NOT EXISTS`**, which in a PostgreSQL schema is often the key to idempotency.

It is also very important to notice that **we don't mutate the `CREATE TABLE` statement** as it wouldn't really apply to an existing schema.
No, we consider **each statement immutable** and we only introduce new statements that move the schema forward.

This way, it doesn't matter what the current schema is, by releasing a new version of the App we ensure that the schema will be
migrated to the state of the art.

> Because **each statement must be idempotent**, we can safely launch as many concurrent instances of the app as we want. Nothing will break down.

👉 Once again, this strategy **apply very well to small schemas for microservices**. I wouldn't really think to build a bigh monolithic schema this way. In such a case, I'd vouche for a migration service as we used to do in the good 'ol times.

## Cleaning Up Old Data

The last bit for this story is the cleanup statement, that we can safely place before the data seeding:

```js
await query(`
  DELETE FROM "public"."users"
  WHERE FLOOR(EXTRACT(EPOCH FROM (now() - created_at)) / 60) > 10;
`);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/090-evolve-your-schema-5dlm5?file=/src/users/seed.js:547-735

---

Here we use a bit of PostgreSQL magic to dynamically drop expired data.

> You may argue that we will waste some resources by dropping all the data and re-seeding right away...

You are correct my friend, you are correct.  
But allow me to remember you that this is just a simple tutorial 😉
