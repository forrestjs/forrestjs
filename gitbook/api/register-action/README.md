<h1 class="tutorial-step"><span>ForrestJS API &raquo;</span> Register Action</h1>

[ForrestJS API](../README.md) &raquo; [Register Action](./README.md)

---

# Register Action

Register and Action to a hook is the way we add new capabilities to a ForrestJS App.

You normally use the `registerAction()` API inside a Service or Feature's Manifest function:

```js
const firstFeature = ({ registerAction }) => {
  registerAction({
    hook: '$INIT_FEATURE',
    handler: () => console.log('Init First Feature'),
  });
};
```

The piece of code above just writes a `console.log` during the booting sequence of the App.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-v64r4?file=/src/index.js:102-226

---

## Signature Variant

You can use the compact signature variant `registerAction(hookName, handler)`:

```js
const actionHandler = () => console.log('Start First Feature');
registerAction('$START_FEATURE', actionHandler);
```

> Althoug I don't use this version so much, a few users found it a necessary add-on to ForrestJS.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-v64r4?file=/src/index.js:230-367

---

## Register Multiple Handlers

A ForrestJS' hook is just a pointer to a list of action handlers. Functions, really.

Every time you register an action, you are simply adding yet another handler to the hook's array.

```js
registerAction('$START_FEATURE', () => console.log('#1 handler'));
registerAction('$START_FEATURE', () => console.log('#2 handler'));
registerAction('$START_FEATURE', () => console.log('#3 handler'));
```

> You can register as many action handlers as you may need to the same hook.  
> **DON'T PUT EVERYTHING IN THE SAME FUNCTION**

Modularity is gold!

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-v64r4?file=/src/index.js:371-607

---

## The Handler Priority

Sometimes, you just need to be sure that a specific handler runs before or after anything else, or just after another particular action handler.

> This is mostly the case when 2 services establish some kind of soft-dependencies towards each other.
> We met this requirement while building our [PostgreSQL Connection Service](../howto/my-first-rest-api/080-integrate-services-and-services/README.md),
> when we integrated it with the [Fastify Service](https://github.com/forrestjs/forrestjs/tree/master/packages/service-fastify#readme).

Here is a simple example where 2 features register an action into the very same hook. Then they are listed into the App's features in the same order
as they are written:

```js
const firstFeature = {
  hook: '$INIT_FEATURE',
  handler: () => console.log('Init First Feature'),
};

const secondFeature = {
  hook: '$INIT_FEATURE',
  handler: () => console.log('Init Second Feature'),
};

runHookApp([firstFeature, secondFeature]);
```

The result of this application would be:

```bash
Init First Feature
Init Second Feature
```

In order to reverse the output without changing the listing order would be to add the `priority` option to either the features:

```js
const firstFeature = {
  hook: '$INIT_FEATURE',
  handler: () => console.log('Init First Feature'),
  priority: -1,
};

const secondFeature = {
  hook: '$INIT_FEATURE',
  handler: () => console.log('Init Second Feature'),
  priority: 1,
};

runHookApp([firstFeature, secondFeature]);
```

The result of this application is now:

```bash
Init Second Feature
Init First Feature
```

The action handlers registered to the same hook are sorted from the higher priority to the lower. The default priority is `0` and you can play with this option so to **affect the execution order independently from the listing order**.

> **NOTE:** You shouldn't abuse of this possibility though. **You should always strive to build truly unentangled Services or Features** that don't rely on one another.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-with-priority-yuibn

---

## Action Meta Information

When using the extended configuration, you can pass any kind of other option along with your action. The info you pass may be used for debugging or tracing purpose by the Service or Feature that creates the hook.

There is still a lot of work-in-progress in improving the App isolation and error tracing of hooks using those Action Meta Information. For now, you can find some examples in this SandBox:

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-options-ey8h0

---
