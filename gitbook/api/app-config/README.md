<h1 class="tutorial-step"><span>ForrestJS API &raquo;</span> The App Config</h1>

[ForrestJS API](../README.md) &raquo; [The App Config](./README.md)

---

# The App Config

A ForrestJS App shares a piece of memory where to **collect any boot-time configuration** and the API to access and manipulate it.

## Provide the App's Configuration

You can use the declarative style where the settings are provided as a simple JavaScript object:

```js
runHookApp({
  settings: {
    key: 'value',
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-config-declarative-dcqg5?file=/src/index.js:1101-1162

---

Or run a more rich settings composition, using an asynchronous function that can perform calculations, or maybe **fetch some secrects from a vault**:

```js
runHookApp({
  settings: async () => {
    return {
      key: 'value',
    };
  },
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-config-programmatic-bbhg7?file=/src/index.js:53-484

---

## Reading From The Configuration

Use `getConfig(key [, defaultValue])` to read from the App's configuration:

```js
const planet = getConfig('user.address.planet');
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-config-declarative-dcqg5?file=/src/index.js:310-386

---

You can be very specific about the info you ask as **the path is formally checked** and the `getConfig()` will throw an error in case the required path does not exists. This behavior helps you to avoid typos in the data-paths you plan to access.

```js
try {
  getConfig('foo.bar.does.not.exists');
} catch (err) {
  console.log(err.message);
}
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-config-declarative-dcqg5?file=/src/index.js:632-807

---

## Default Values

It may happen that you want to apply a default value to a non existing config key.

This could be useful in case you want to set a loose dependency on an optional Service or Feature that may or may not provide some information:

```js
const optData = getConfig('opt.data', 'foobar');
```

> When using the default value you (obviously) loose the strict check on the path's correctness. Be careful with that!

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/app-config-declarative-dcqg5?file=/src/index.js:813-1037

---

## Array Support

The set/get config is based on a small utility called [dotted](https://www.npmjs.com/package/@marcopeg/dotted). There is a primitive support for accessing data in array format. Please refer to the documentation in the NPM page.
