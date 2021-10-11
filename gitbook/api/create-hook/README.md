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
const myService = ({ registerAction }) => {
  registerAction({
    hook: '$INIT_SERVICE',
    handler: ({ createHook }) => {
      console.log('myService::init()');
      createHook.sync('myService::init');
      console.log('myService::afterInit');
    },
  });
};

const myFeature = ({ registerAction }) => {
  registerAction({
    hook: 'myService::init',
    handler: () => console.log('myFeature, on myService::init'),
  });
};

runHookApp({
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

[[TO BE COMPLETED]]

## Collecting Actions Returing Values

[[TO BE COMPLETED]]

## createHook.sync

[[TO BE COMPLETED]]

## createHook.serie

[[TO BE COMPLETED]]

## createHook.parallel

[[TO BE COMPLETED]]

## createHook.waterfall

[[TO BE COMPLETED]]
