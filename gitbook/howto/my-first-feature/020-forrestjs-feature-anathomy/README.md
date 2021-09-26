<h1 class="tutorial-step"><span>My First Feature &raquo;</span> A Feature's Anatomy</h1>

[My First Feature](../README.md) &raquo; [A Feature Anathomy](./README.md)

---

# A Feature's Anatomy

A ForrestJS feature is a **Javascript module** that receives a bunch of APIs to **describe how to integrate** with the rest of the app.

Start by creating a feature's scaffold into `my-first-feature.js`:

```js
const myFirstFeature = ({ registerAction, getConfig, ...otherApi }) => {
  // ... the feature's manifest goes here ...
};

module.exports = module.exports;
```

Once you've created the feature, simply add it to your App's manifest:

```js
runHookApp({
  ...
  features: [
    require('./my-first-feature')
  ]
})
```

> 👉 It is very important to **give a name to your feature** using a named arrow function (as we do here) or by using the `function` keyword as in old fashioned functions.


---

**💻 Live on CodeSandbox:**   
https://codesandbox.io/s/forrestjs-feature-anathomy-46e7c?file=/src/index.js

---


## It's Just a Manifest

I believe that it is important to point out that **both App's and Feature's entry files are just manifests**.

- The single responsibility of an App's manifest is to describe which Services and Features are at play in the app
- The single responsibility of a Feature's manifest is to describe how the Feature integrates with the App's lifecycle and services

> All your logic should always be places inside a registered action (see next chapter)

## Different Ways to Export a Feature

It's said that:

> In Javascript there are at least 5 different ways to achieve the same result?

Here are a few different syntaxes how to export a Feature's manifest from a Javascript module. They are all equivalent to one another, and the most important fact is that we **always and explicitly give a name to the exported manifest** function.

### ES5 Exports Style

With the `function` keyword:

```js
module.exports = function myFirstFeature () {}
```

With a named function:

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