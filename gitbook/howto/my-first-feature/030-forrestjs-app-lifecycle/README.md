<h1 class="tutorial-step"><span>My First Feature &raquo;</span> The Boot Order & App's Lifecycle</h1>

[My First Feature](../README.md) &raquo; [A Feature Anathomy](./README.md)

---

# The Boot Order & App's Lifecycle

Features and Services manifest are **executed synchronously and in the same order as they are declared** in the App's manifest.

> The **single responsibility** of the Feature manifest's function is to **register actions into existing hooks**, extending the App's capabilities with custom logic.

A ForrestJS App ships [a list of **lifecycle hooks**](https://github.com/forrestjs/forrestjs/blob/master/packages/hooks/docs/create-hook-app.md) that can be used to manage an orchestated the booting sequence of your application:

```js
const feature1 = {
  hook: '$INIT_FEATURE',
  handler: () => console.log('> feature 1'),
};

const feature2 = {
  hook: '$INIT_FEATURE',
  handler: () => console.log('> feature 2'),
};
```

In the example above, both features register an action into the same hook. In this case, the order of the features will determine which one comes first:

```js
forrestjs.run([feature1, feature2]);

// > feature 1
// > feature 2

forrestjs.run([feature2, feature1]);

// > feature 2
// > feature 1
```

But the order of the features doesn't affect the execution order of different lifecycle hooks:

> 👉 INIT comes before START

```js
const feature1 = {
  hook: '$START_FEATURE',
  handler: () => console.log('> feature 1'),
};

const feature2 = {
  hook: '$INIT_FEATURE',
  handler: () => console.log('> feature 2'),
};

forrestjs.run([feature1, feature2]);

// > feature 2
// > feature 1
```

This happens because the `$INIT_FEATURE` hooks is always fired _before_ the `$START_FEATURE` one.

> Use the lifecycle hooks if you want to guarantee a proper timing in the execution of your logic.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/forrestjs-app-lifecycle-qkxep?file=/src/index.js

---

## ForrestJS Lifecyle Hooks

Here is a comprehensive list of the existing lifecycle hooks.

### $START

_Services Only_

### $SETTINGS

_Services Only_

### $INIT_SERVICE(S)

### $INIT_FEATURE(S)

### $START_SERVICE(S)

### $START_FEATURE(S)

### $FINISH
