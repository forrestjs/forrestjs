<h1 class="tutorial-step"><span>ForrestJS API &raquo;</span> Create Hook</h1>

[ForrestJS API](../README.md) &raquo; [Create Hook](./README.md)

---

# Create Hook

To "create a new Hook" is the way for other Services or Feature to inject logic into ours, hence expanding the capabilities of our code.

> The classic example is to provide a way for Features to inject some queries as soon the connection towards a db gets established.
>
> 👉 We did exactly that in the [My First REST API / Integrate Services and Features](howto/my-first-rest-api/060-integrate-services-and-features/) tutorial.

## It's Just a Function

It's important to understand that a Hook is just a programmable function that we call within a registered action:

```js
const myService = {
  hook: '$INIT_SERVICE',
  handler: ({ createHook }) => {
    console.log('myService::init()');
    createHook.sync('myService::init');
    console.log('myService::afterInit');
  },
};

const myFeature = {
  hook: 'myService::init',
  handler: () => console.log('myFeature, on myService::init'),
};

forrestjs.run({
  services: [myService],
  features: [myFeature],
});
```

This simple App defines a custom Service that hooks into the App's lifecyle, log something, then creates a Hook for other components to inject some code.

The custom Feature register an Action into that hook, injecting new logic into it.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-sync-04yy4?file=/src/index.js

---

👉 The baseline is that creating a Hook is just like running a function, but **this function behaves like a black-box** as we can't know in advance who will register Actions into it.

As with functions:

- a Hook has a **unique name** that is simply a string
- you can pass arguments into a Hook
- you can collect the returning values from each registered Action

## The Hooks Manifest

So far we used simple strings as Hooks' names. That makes it for a very fast development cycle, but it opens up the Gates of Hell for typos and any kind of nasty mistakes.

> **Don't worry:** there is a way around this issue that solves most of the typos scenario, while preserving coding speed 😎.

The first step is to **build a _Hooks Manifest_** for your Service. It is just a key/value store where you will list all the extension points that your Service will use:

```js
const myServiceHooks = {
  MY_SERVICE_INIT: 'myService/init',
  MY_SERVICE_START: 'myService/start',
};
```

Then you jump into your Service Manifest's function and register it:

```js
const myService = ({ registerAction, registerHook }) => {
  // Register the Hooks Manifest
  registerHook(myServiceHooks);

  // ... register your actions
};
```

> This effort will build an internal dictionary of all the Hooks available to the ForrestJS App.

From now on it's easy.

First, you should now use the symbols when you run the Hooks:

```js
// Create your hooks using symbols from the manifest:
createHook.sync(myServiceHooks.MY_SERVICE_INIT);
```

And then you can reference those symbols with the `$` when you register the actions:

```js
registerAction({
  hook: '$MY_SERVICE_INIT',
  handler: () => console.log('firstFeature, on myService::init'),
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-reference-ewqkn?file=/src/index.js

---

By using the `$` sign at the beginning of your Hook name you ask ForrestJS to formally validate its existance against the internal dictionary.

If the Hook does not exists, ForrestJS will throw an error and your App will fail to start. So you will be able to catch on all those silly mistakes real time while building your Features.

### Register Optional Actions

There are situations in which you want to register an Action, but you don't really know for sure whether the Hook will be available because it depends on the App's final composition.

> This is a classic in Service-to-Service integration.

You can append a `?` at the end of a formally checked Hook to avoid the error in case the Hook is not registered:

```js
registerAction({
  hook: '$ONLY_IF_EXISTS?',
  handler: () => console.log('firstFeature, on myService::init'),
});
```

👉 With this option, you must be really sure that you are referencing the correct Hook, as typos are on you here!

## Passing Arguments

When you create a Hook you can pass arguments to it as a single object:

```js
createHook.sync('hookName', {
  foo: 'bar',
});

registerAction({
  hook: 'hookName',
  handler: ({ foo }) => console.log(`foo: ${foo}`),
});
```

This mechanic is often used to pass down APIs and/or utility functions.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-arguments-pgmwz?file=/src/index.js

---

## Collecting Actions Returing Values

It is also possible to collect and manipulate each registered Action's returning values:

```js
const data = createHook.sync('foobar');

registerAction({
  hook: 'foobar',
  handler: () => 5,
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-returning-values-66xq3?file=/src/index.js

---

Each Action's returning value is represented by a _positional array_ with:

- [0] raw returning value
- [1] action configuration
- [2] hook configuration

[[TO BE EXPANDED]]

## createHook.sync()

The `sync` method is the most common and used Hook. It runs its registered actions in serie, sorted by priority, and it expects only synchronous functions.

Use this method to provide ways to enrich or modify configuration at boot time. A good example is how we register routes in the [Fastify Service](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify/src/start-service-handler.js#L41).

```js
const results = createHook.sync('hookName', { arg1: 'x', arg2: 'y' });
```

## createHook.serie()

Use the `serie` method when you want **asynchronous** Action handlers to **execute one after the other**, by the registration or priority order.

> The returning values will reflect the execution order.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-serie-e6670?file=/src/index.js

---

## createHook.parallel()

Use the `parallel` method when you want **asynchronous** Action handlers to **execute at the same time**, triggered by by the registration or priority order.

> The returning values will reflect the trigger order.

```js
const results = createHook.parallel('hookName', { arg1: 'x', arg2: 'y' });
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-parallel-qylzn?file=/src/index.js

---

## createHook.waterfall()

Use the `waterfall` method if you want to let **synchronous** Action handlers to transform a received input by returning a new version of it.

> The Action handlers are executed by the registration or priority order.

In the end, the returning value will yield the value that was returned by the last handler.

```js
const result = createHook.watefall('hookName', 10);
console.log(result.value);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-waterfall-j4hnc?file=/src/index.js

---
