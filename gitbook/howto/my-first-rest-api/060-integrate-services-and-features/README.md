<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Integrate Services and Features</h1>

[My First Feature](../README.md) &raquo; [Integrate Services and Features](./README.md)

---

# Integrate Services and Features

What we've done so far is already pretty cool, but let's just make an small extra affort and expose a `query` function instead of the entire pool.

In your Service Initialization code, you need to create the utility method and export it:

```js
const query = pool.query.bind(pool);
setContext('pg.query', query);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/060-integrate-services-and-features-z267f?file=/src/pg/index.js:808-949

---

With this part done, a potential feature's code would change to:

```js
registerAction({
  target: '$START_FEATURE',
  handler: async ({ getContext }) => {
    const query = getContext('pg.query');
    await query('SELECT ...');
  },
});
```

It's a small improvement, right?  
**🧘‍♀️ But Life is made good by the Little Things! 🧘‍♀️**

## Offer a New Hook "$PG_READY"

Wouldn't be nice if any Feature (or Service) could run some custom queries at boot time? For example, to setup it's own schema, or seed some data?

What if a feature could run a piece of code like that:

```js
registerAction({
  target: '$PG_READY',
  handler: async ({ query }) => {
    await query(`CREATE TABLE IF NOT EXISTS ...`);
    await query(`INSERT INTO "xxx" VALUES... `);
  },
});
```

As you may have guessed already, that's exactly what we're going to do.

## Register Service's Extension Targets

The first step is to build a _Targets Manifest_ for our service. This component will simply export all the new extension that are offered by the service.

Create a `/pg/targets.js` module:

```js
module.exports = {
  PG_READY: 'pg/ready',
};
```

That's right. Extensions are just strings, but we always export them as a **library of symbols** so that ForrestJS can handle a formal check on hooks existance, **avoiding us the pain of runtime misspell-driven mistakes**.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/060-integrate-services-and-features-z267f?file=/src/pg/hooks.js:122-166

---

In your Service's manifest you can now use the `registerTargets()` API to inform ForrestJS of these new hooks.

Open `/pg/index.js` and add:

```js
const targets = require("./targets");

const pg = ({ registerAction, registerTargets }) => {
  // Register pg's extension points into ForrestJS targets dictionary:
  registerTargets(targets);

  ...
});
```

With these steps performed, it is now possibile for any Feature (or other Service) to register an action to our `PG_READY` hook. Of course, there would be no effects still, as we haven't yet implemented the hook.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/060-integrate-services-and-features-z267f?file=/src/pg/index.js:249-343

---

## Create a new Action

Implementing a ForrestJS Extension looks much like **calling a function** using the [`createExtension()` API](../../../api/create-extension/README.md). We invoke an Extension by its name, we can pass arguments to it, and we can collect its returning value(s).

> But we can't control what happens inside it, as different Features and Services are allowed to inject logic into it.

With this theory covered, it's time to implent our shiny new hook right after a correct connection towards PostgreSQL is first established:

```js
registerAction({
  target: '$START_SERVICE',
  handler: async ({ createExtension }) => {
    // ... connect to PostgreSQL ...

    // Call the target:
    await createExtension.serie('$PG_READY', { query, pool });
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/060-integrate-services-and-features-z267f?file=/src/pg/index.js:1578-1797

---

## Consume the New Hook

Finally, we can consume that hook in our Users Feature:

```js
registerAction({
  target: '$PG_READY',
  handler: async ({ query }) => {
    const res = await query('SELECT NOW()');
    console.log('on pg/ready', res.rows);
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/060-integrate-services-and-features-z267f?file=/src/users/index.js:729-892

---
