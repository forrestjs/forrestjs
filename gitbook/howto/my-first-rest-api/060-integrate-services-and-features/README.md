<h1 class="tutorial-step"><span>My First REST API &raquo;</span> Integrate Services and Features</h1>

[My First Feature](../README.md) &raquo; [Integrate Services and Features](./README.md)

---

# Integrate Services and Features

What we've done so far is already pretty cool, but let's just make an small extra export to expose a `query` function instead of the entire pool.

In your Service Initialization code, you need to create the utility method and export it:

```js
const query = pool.query.bind(pool);
setContext("pg.query", query);
```

---

**💻 Live on CodeSandbox:**   
https://codesandbox.io/s/060-integrate-services-and-features-z267f?file=/src/pg/index.js:531-672

---

With this part done, a potential feature's code would change to:

```js
registerAction({
  hook: "$START_FEATURE",
  handler: async ({ getContext }) => {
    const query = getContext("pg.query");
    await query('SELECT ...');
  }
});
```

It's a small improvement, right?   
**🧘‍♀️ But Life is made good by the little things! 🧘‍♀️**

[[ TO BE CONTINUED ]]
