<h1 class="tutorial-step"><span>ForrestJS API &raquo;</span> Create Extension</h1>

[ForrestJS API](../README.md) &raquo; [Create Extension](./README.md)

---

# Create Extension

Services and Features interact with the App's Lifecycle and with each others by creating new Extension.

> CLASSIC EXAMPLE:
>
> 1. Our App uses a Service to establish a connection to Postgres
> 2. A Feature needs to run a SQL query as soon the connection exists
>
> 👉 We solved this situation in the [My First REST API / Integrate Services and Features](howto/my-first-rest-api/060-integrate-services-and-features/) tutorial. Go check it out!

## It's Just a Function

It's important to understand that an Extension is just a **programmable function** that we call within a registered Action:

```js
const myService = {
  target: '$INIT_SERVICE',
  handler: ({ createExtension }) => {
    console.log('myService::init()');
    createExtension.sync('foobar');
    console.log('myService::afterInit');
  },
};

const myFeature = {
  target: 'foobar',
  handler: () => console.log('myFeature, on myService::init'),
};

forrestjs.run({
  services: [myService],
  features: [myFeature],
});
```

This simple App defines a custom Service that:

1. registers an Action into the App's Lifecyle
2. log something
3. creates an Extension allowing other Features to inject some code
4. log something else

The custom Feature registers an Action into that Extension, injecting new logic into it.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-sync-04yy4?file=/src/index.js

---

👉 The baseline is that creating an Extension is just like running a regular function, but **this function behaves like a black-box** as we can't know in advance who will register Actions into it.

As with functions:

- an Extension has a **unique name** that is simply a string
- you can pass arguments into an Extension
- you can collect the returning values from each registered Action

## The Extension Targets Manifest

So far we used simple strings as Extensions' names. That makes it for a very fast development cycle, but it opens up the Gates of Hell for typos and any kind of nasty mistakes.

> **Don't worry:** there is a way around this issue that solves most of the typos scenario, while preserving coding speed 😎.

The first step is to **build an _Extensions Targets Manifest_** for your Service. It is just a key/value store where you will list all the extension points that your Service will use:

```js
const myServiceExtensions = {
  MY_SERVICE_INIT: 'myService/init',
  MY_SERVICE_START: 'myService/start',
};
```

Then you jump into your Service Manifest's function and register it:

```js
const myService = ({ registerAction, registerTargets }) => {
  // Register the Extension Targets
  registerTargets(myServiceExtensions);

  // ... register your actions
};
```

> This will build an internal dictionary of all the Extensions available to the Application.

From now on it's easy.

First, you should now use the symbols when you run the Extension:

```js
// Create your hooks using symbols from the manifest:
createExtension.sync(myServiceHooks.MY_SERVICE_INIT);
```

And then you can reference those symbols with the `$` when you register the actions:

```js
registerAction({
  target: '$MY_SERVICE_INIT',
  handler: () => console.log('firstFeature, on myService::init'),
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-reference-ewqkn?file=/src/index.js

---

> By using the `$` sign at the beginning of your Target name you ask ForrestJS to formally validate its existance against the internal Action Targets manifest.

If the Extension does not exists, ForrestJS will throw an error and your App will fail to start. So you will be able to **catch on all those silly mistakes in real time** while building your Features.

### Register Optional Actions

There are situations in which you want to register an Action, but you don't really know for sure whether the Extension will be available because it depends on the App's final composition.

> This is a classic in Service-to-Service integration.

You can append a `?` at the end of a formally checked Target to avoid the error in case the Extension is not registered:

```js
registerAction({
  target: '$ONLY_IF_EXISTS?',
  handler: () => console.log('firstFeature, on myService::init'),
});
```

👉 With this option, you must be really sure that you are referencing the correct Extension, as typos are on you here! End-to-end tests will help a lot.

## Passing Arguments

When you create an Extension you can pass arguments to it as a single object:

```js
createExtension.sync('extensionName', {
  foo: 'bar',
});

registerAction({
  target: 'extensionName',
  handler: ({ foo }) => console.log(`foo: ${foo}`),
});
```

This mechanic is often used to pass down APIs and/or utility functions.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-arguments-pgmwz?file=/src/index.js

---

## Collecting Action Handlers Returing Values

It is also possible to collect and manipulate each registered Action's Handler returning values:

```js
// Register some Actions:
registerAction('foobar', () => 5);
registerAction('foobar', () => 10);

// Run the Extension and collect the results:
const data = createExtension.sync('foobar');
console.log(data);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-returning-values-66xq3?file=/src/index.js

---

Each Action Handler's returning value is represented by a _positional array_ with:

- [0] raw returning value
- [1] Action configuration
- [2] Extension configuration

[[TO BE EXPANDED]]

## createExtension.sync()

The `sync` method is the most common and used type of Extension. It runs its registered Actions in serie, sorted by priority, and it expects only synchronous functions.

Use this method to provide ways to enrich or modify configuration at boot time. A good example is how we register routes in the [Fastify Service](https://github.com/forrestjs/forrestjs/blob/master/packages/service-fastify/src/start-service-handler.js#L41).

```js
const results = createExtension.sync('extensionName', { arg1: 'x', arg2: 'y' });
```

## createExtension.serie()

Use the `serie` method when you want **asynchronous** Action Handlers to **execute one after the other**, by the registration or priority order.

> The returning values will reflect the execution order.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-serie-e6670?file=/src/index.js

---

## createExtension.parallel()

Use the `parallel` method when you want **asynchronous** Action Handlers to **execute at the same time**, triggered by by the registration or priority order.

> The returning values will reflect the trigger order.

```js
const results = createExtension.parallel('extensionName', {
  arg1: 'x',
  arg2: 'y',
});
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-parallel-qylzn?file=/src/index.js

---

## createExtension.waterfall()

Use the `waterfall` method if you want to let **synchronous** Action Handlers to transform a received input by returning a new version of it.

> The Action handlers are executed by the registration or priority order.

In the end, the returning value will yield the value that was returned by the last handler.

```js
const result = createExtension.watefall('extensionName', 10);
console.log(result.value);
```

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/create-hook-waterfall-j4hnc?file=/src/index.js

---
