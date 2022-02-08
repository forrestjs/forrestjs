<h1 class="tutorial-step"><span>My First Feature &raquo;</span> A Feature's Anatomy</h1>

[My First Feature](../README.md) &raquo; [A Feature Anathomy](./README.md)

---

# A Feature's Anatomy

A ForrestJS _Feature_ is a **JavaScript module** that receives a bunch of APIs and **describes how to integrate** with the rest of the _App_.

Integrations happen via **creating Extensions** and **registering Actions**.

> Most of the times, you will register Actions to Extensions that are provided by
> stuff that you download from NPM. Those are usually called Services and provide
> wrappers around famous libraries like Fastify or React.

👉 The **Action Handlers** are regular Javascript functions that receive the ForrestJS APIs and (maybe) some arguments from the Extension.

**You will implement your business logic into Action Handlers.**

---

There are **two and a half ways** to create a Feature:

- Declarative Features
  - As a _declarative Action manifest_
  - As a _list of declarative Action manifests_
- Functional Features

### Declarative Features

This is the easiest way to describe a Feature and it will be enough most of the times:

```js
const forrestjs = require('@forrestjs/core');

// This Feature registers one single Action to the Extension named "FINISH":
const myFirstFeature = {
  target: '$FINISH',
  handler: () => console.log('Hello World'),
};

// This Feature registers multiple Actions to a variety of Extensions:
// (same as before, but it's a list)
const mySecondFeature = [
  {
    target: '$INIT_FEATURE',
    handler: () => console.log('On mySecondFeature Init'),
  },
  {
    target: '$START_FEATURE',
    handler: () => console.log('On mySecondFeature Start'),
  },
  {
    target: '$FINISH',
    handler: () => console.log('On mySecondFeature Finish'),
  },
];

// Run the ForrestJS App:
forrestjs.run([myFirstFeature, mySecondFeature]);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/forrestjs-declarative-feature-6no25

---

### Functional Features

Functional Features are just regular Javascript functions that **receive the full APIs** of a ForrestJS App. They can simply perform more convoluted logic before registering some Actions.

Start by creating a feature's scaffold into `my-first-feature.js`:

```js
const myFirstFeature = ({ registerAction }) => {
  // Perform convoluted logic at register time:
  console.log('On myFirstFeature Register');

  // You can use the APIs to register new Actions:
  registerAction({
    target: '$FINISH',
    handler: () => console.log('Just a roughe FINISH action handler'),
  });

  // or return one or multiple Actions you want to register
  // similarly to the declarative way:
  return [
    {
      target: '$INIT_FEATURE',
      handler: () => console.log('On myFirstFeature Init'),
    },
    {
      target: '$START_FEATURE',
      handler: () => console.log('On myFirstFeature Start'),
    },
    {
      target: '$FINISH',
      handler: () => console.log('On myFirstFeature Finish'),
    },
  ];
};

module.exports = myFirstFeature;
```

Once you've created the feature, simply add it to your App's manifest:

```js
const forrestjs = require('@forrestjs/core');

// Import your Feature
const myFirstFeature = require('./my-first-feature');

// Run the ForrestJS App
forrestjs.run([myFirstFeature]);
```

> 👉 It is very important to **give a name to your feature** using a named arrow function (as we do here) or by using the `function` keyword as in old fashioned functions.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/forrestjs-feature-anathomy-46e7c?file=/src/my-first-feature.js:0-557

---

## It's Just a Manifest

I believe that it is important to point out that **both App's and Feature's entry files are just manifests**.

- The single responsibility of an **App's Manifest** is to describe which Services and Features compose your App
- The single responsibility of a **Feature's Manifest** is to describe how the Feature integrates with the App's lifecycle and Services by registering Actions

> All your logic should always be placed inside a registered Aaction Handler (see next chapter)

## Different Ways to Export a Feature

It's said that:

> In Javascript there are at least 5 different ways to achieve the same result?

Here are a few different syntaxes how to export a Feature's manifest from a Javascript module. They are all equivalent to one another, and the most important fact is that we **always and explicitly give a name to the exported manifest** function.

### ES5 Exports Style

With the `function` keyword:

```js
module.exports = function myFirstFeature() {};
```

With a named function:  
<small>(this is the preferred way)</small>

```js
const myFirstFeature = () => {};
module.exports = myFirstFeature;
```

With multiple exports:

```js
exports.name = 'myFirstFeature';
exports.register = () => {};
```

### ES6 Export Style

```js
const myFirstFeature = () => {};
export default myFirstFeature;
```

### Declarative Way

```js
// Single Action
module.exports = {
  name: 'myFeatureName',
  target: '$FINISH',
  handler: () => {},
};

// Multiple Actions
// (you have to explicitly set the name for each Action)
module.exports = [
  {
    name: 'myFeatureName',
    target: '$INIT_FEATURE',
    handler: () => {},
  },
  {
    name: 'myFeatureName',
    target: '$INIT_FEATURE',
    handler: () => {},
  },
];
```
