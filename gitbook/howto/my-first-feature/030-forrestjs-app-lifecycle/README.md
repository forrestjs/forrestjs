<h1 class="tutorial-step"><span>My First Feature &raquo;</span> The Boot Order & App's Lifecycle</h1>

[My First Feature](../README.md) &raquo; [The Boot Order & App's Lifecycle](./README.md)

---

# The Boot Order & App's Lifecycle

Features and Services manifest's functions are **executed synchronously and in the same order as they are declared** in the App's manifest.

> The **Single Responsibility** of the Feature Manifest's function is to **register Actions into existing Extensions**, extending the App's capabilities with custom logic.

A ForrestJS App ships [a list of **Lifecycle Extensions**](../../../api/forrestjs-run/README.md#app-boot-lifecycle-in-forrestjs) that can be used to manage an orchestated the booting sequence of your application:

```js
const feature1 = {
  target: '$INIT_FEATURE',
  handler: () => console.log('> feature 1'),
};

const feature2 = {
  target: '$INIT_FEATURE',
  handler: () => console.log('> feature 2'),
};
```

In the example above, both features register an action into the same hook. In this case, the order of the features will determine which one comes first:

```js
forrest.run({ features: [feature1, feature2] });

// > feature 1
// > feature 2

forrest.run({ features: [feature2, feature1] });

// > feature 2
// > feature 1
```

But the order of the features doesn't affect the execution order of different lifecycle hooks:

> 👉 INIT comes before START

```js
const feature1 = {
  target: '$START_FEATURE',
  handler: () => console.log('> feature 1'),
};

const feature2 = {
  target: '$INIT_FEATURE',
  handler: () => console.log('> feature 2'),
};

forrest.run({ features: [feature1, feature2] });

// > feature 2
// > feature 1
```

This happens because the `$INIT_FEATURE` Lifecycle Extension is always fired _before_ the `$START_FEATURE` one.

> Use the Lifecycle Extensions if you want to guarantee proper timing in the execution of your logic.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/forrestjs-app-lifecycle-qkxep?file=/src/index.js

---

## ForrestJS Lifecyle Extensions

👉 [Here is a comprehensive list of the existing Lifecyle Extensions](../../../api/forrestjs-run/README.md#app-boot-lifecycle-in-forrestjs) 👈
