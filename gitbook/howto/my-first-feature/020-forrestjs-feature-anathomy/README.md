<h1 class="tutorial-step"><span>My First Feature &raquo;</span> A Feature's Anatomy</h1>

[My First Feature](../README.md) &raquo; [A Feature Anathomy](./README.md)

---

# A Feature's Anatomy

A ForrestJS _Feature_ is a **JavaScript module** that receives a bunch of APIs and **describes how to integrate** with the rest of the _App_.

There are two and a half ways to create a feature:

- Declarative Features
  - As a _declarative action_
  - As a _list of declarative actions_
- Functional Features

### Declarative Features

This is the easiest way to describe a Feature and it will be enough most of the times:

```js
const forrestjs = require('@forrestjs/hooks');

// This Feature registers to one single Action:
const myFirstFeature = {
  hook: '$FINISH',
  handler: () => console.log('Hello World'),
};

// This Feature registers to multiple Actions:
// (same as before, but it's a list)
const mySecondFeature = [
  {
    hook: '$INIT_FEATURE',
    handler: () => console.log('On mySecondFeature Init'),
  },
  {
    hook: '$START_FEATURE',
    handler: () => console.log('On mySecondFeature Start'),
  },
  {
    hook: '$FINISH',
    handler: () => console.log('On mySecondFeature Finish'),
  },
];

// Run the ForrestJS App
forrestjs.run([myFirstFeature, mySecondFeature]);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/forrestjs-declarative-feature-6no25

---

### Functional Features

Functional Features are just regular Javascript functions that **receive the full APIs** of a ForrestJS App. They can simply perform more convoluted logic while registering to some Actions.

Start by creating a feature's scaffold into `my-first-feature.js`:

```js
const myFirstFeature = ({ registerAction }) => {
  // Perform convoluted logic at register time:
  console.log('On myFirstFeature Register');

  // Return one or multiple Actions you want to register to:
  return [
    {
      hook: '$INIT_FEATURE',
      handler: () => console.log('On myFirstFeature Init'),
    },
    {
      hook: '$START_FEATURE',
      handler: () => console.log('On myFirstFeature Start'),
    },
    {
      hook: '$FINISH',
      handler: () => console.log('On myFirstFeature Finish'),
    },
  ];
};

module.exports = myFirstFeature;
```

Once you've created the feature, simply add it to your App's manifest:

```js
const forrestjs = require('@forrestjs/hooks');

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

- The single responsibility of an **App's Manifest** is to describe which _Services_ and _Features_ are at play in the _App_
- The single responsibility of a **Feature's Manifest** is to describe how the Feature integrates with the _App_'s lifecycle and _Services_

> All your logic should always be placed inside a registered action (see next chapter)

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
