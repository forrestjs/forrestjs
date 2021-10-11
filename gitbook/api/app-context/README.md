<h1 class="tutorial-step"><span>ForrestJS API &raquo;</span> The App Context</h1>

[ForrestJS API](../README.md) &raquo; [The App Context](./README.md)

---

# The App Context

A ForrestJS App runs inside a **scoped memory context** where _Services_ and _Features_ can share data and APIs.

## How Access the API

The `setContext()` and `getContext()` are given as arguments to any ForrestJS Service and Feature's manifest function:

```js
const myService = ({ setContext, getContext }) => {
  // write your manifest
};
```

And into any ForrestJS action in the second argument:

```js
registerAction({
  hook: '$SOME_HOOK',
  handler: (_, { setContext, getContext }) => {
    // handle your action
  },
});
```

> **NOTE:** all the lifecycle hooks (`$INIT_SERVICE`, `$INIT_FEATURE`, etc...) provide the same object as first _and_ second parameter to the action handler function.

## Writing To The Context

Use the `setContext(key, val)` API to write into the ForrestJS App memory context.

You can pass a nested key path and the proper data structure will be automatically created for you. The value could be any valid JavaScript object.

```js
// Set a key/value:
setContext('key', 'value');

// Set a complex object:
setContext('key', { name: 'foobar', value: 123 });

// Set a nested object property:
setContext('deep.nested.key', 123);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-context-movq4?file=/src/index.js:248-347

---

You can mix the key notation with path notation to mutate only portions of the context:

```js
// First set a context:
setContext('user', {
  name: 'Luke Skywalker',
  address: {
    planet: 'Tatooine',
    region: 'desert',
  },
});

// Then change only part of it:
setContext('user.address.region', 'lakes');
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-context-movq4?file=/src/index.js:353-642

---

## Reading From The Context

Use `getContext(key [, defaultValue])` to read from the App's context:

```js
const planet = getContext('user.address.planet');
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-context-movq4?file=/src/index.js:1018-1093

---

You can be very specific about the info you ask as **the path is formally checked** and the `getContext()` will throw an error in case the required path does not exists. This behavior helps you to avoid typos in the data-paths you plan to access.

```js
try {
  getContext('foo.bar.does.not.exists');
} catch (err) {
  console.log(err.message);
}
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-context-movq4?file=/src/index.js:1168-1328

---

## Default Values

It may happen that you want to apply a default value to a non existing context key. This could be useful in case you want to set a loose dependency on an optional Service or Feature that may or may not provide some information:

```js
const optData = getContext('opt.data', 'foobar');
```

> When using the default values you (obviously) loose the strict check on the path's correctness. Be careful with that!

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-context-movq4?file=/src/index.js:1334-1462

---

## Array Support

The set/get context is based on a small utility called [dotted](https://www.npmjs.com/package/@marcopeg/dotted). There is a primitive support for accessing data in array format. Please refer to the documentation in the NPM page.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-context-movq4?file=/src/index.js:1468-1577

---
