# My First Feature

A ForrestJS feature is an isolated module that implements existing hooks, creating new business value for the application.

## Install the Dependencies

In this toutorial we will use the hooks library in order to describe a modular application:

```bash
npm add @forrestjs/hooks
```

## App's Scaffold

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

## A Feature's Anatomy

A ForrestJS feature is a **Javascript module** that receives a bunch of APIs to **describe how to integrate** with the rest of the app:

```js
/**
 * my-first-feature.js
 */

module.exports = ({ registerAction, getConfig, ...otherApi }) => {
  // ... logic here ...
};
```

Once you create a feature, you simply add it to your app:

```js
runHookApp({
  ...
  features: [
    require('./my-first-feature')
  ]
})
```

## The Boot Order & App's Lifecycle

Features and Services manifest are executed synchronously and in the same order as they are declared.

> The **single responsibility** of the Feature's function (manifest) is to **register actions into existing hooks**, expanding the App's capabilities with custom logic.

A ForrestJS App ships [a list of **lifecycle hooks**](https://github.com/forrestjs/forrestjs/blob/master/packages/hooks/docs/create-hook-app.md) that can be used to manage an orchestated boot of your application:

```js
const feature1 = ({ registerAction }) => {
  registerAction({
    hook: '$INIT_FEATURE',
    handler: () => console.log('> feature 1')
  })
}

const feature2 = ({ registerAction }) => {
  registerAction({
    hook: '$INIT_FEATURE',
    handler: () => console.log('> feature 2')
  })
}
```

In the example above, both features register an action into the same hook. In this case, the order of the features will determine which one comes first:

```js
runHookApp({
  ...
  features: [
    feature1,
    feature2
  ]
})

// > feature 1
// > feature 2

runHookApp({
  ...
  features: [
    feature2,
    feature1
  ]
})

// > feature 2
// > feature 1
```

But the order of the features doesn't affect the execution order of different lifecycle hooks:

```js
const feature1 = ({ registerAction }) => {
  registerAction({
    hook: '$START_FEATURE',
    handler: () => console.log('> feature 1')
  })
}

const feature2 = ({ registerAction }) => {
  registerAction({
    hook: '$INIT_FEATURE',
    handler: () => console.log('> feature 2')
  })
}

runHookApp({
  ...
  features: [
    feature1,
    feature2
  ]
})

// > feature 2
// > feature 1
```

This happens because the `$INIT_FEATURE` hooks is always fired _before_ the `$START_FEATURE` one.

> Use the lifecycle hooks if you want to guarantee a proper timing in the execution of your logic.