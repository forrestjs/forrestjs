<h1 class="tutorial-step"><span>My First Feature &raquo;</span> ForrestJS App's Scaffold</h1>

[My First Feature](../README.md) &raquo; [ForrestJS App Scaffold](./README.md)

---

# ForrestJS App's Scaffold

Create a new `app.js` file and use the following scaffold to kick off a new ForrestJS App:

```js
const { runHookApp } = require("@forrestjs/hooks");

runHookApp({
  trace: "compact",
  settings: {},
  services: [],
  features: []
}).catch(console.error);
```

Once ready, you can run it with:

```sh
npx nodemon app
```

---

**💻 Live on CodeSandbox:**   
https://codesandbox.io/s/010-forrestjs-app-scaffold-23g6w?file=/src/index.js

---