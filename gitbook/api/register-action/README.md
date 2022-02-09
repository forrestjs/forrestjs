<h1 class="tutorial-step"><span>ForrestJS API &raquo;</span> Register Action</h1>

[ForrestJS API](../README.md) &raquo; [Register Action](./README.md)

---

# Register Action

You need to **register an _Action_ to an _Extension_** to add functionalities to a ForrestJS App.

Use the `registerAction()` API inside a _Service_ or _Feature_'s _Manifest_ function:

```js
const myFirstFeature = ({ registerAction }) => {
  registerAction({
    target: '$INIT_FEATURE',
    handler: () => console.log('My First Feature'),
  });
};
```

The piece of code above just writes a `console.log` during the booting sequence of the App.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-v64r4?file=/src/index.js:102-226

---

## Signature Variant

You can use the compact signature variant:  
`registerAction(extensionName, handler)`:

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

A ForrestJS' Extension is just a pointer to a list of Action Handlers.  
_Regular Javascript functions, really._

Every time you register an Action, you are simply adding yet another handler to the Extension's array.

```js
registerAction('$START_FEATURE', () => console.log('#1 handler'));
registerAction('$START_FEATURE', () => console.log('#2 handler'));
registerAction('$START_FEATURE', () => console.log('#3 handler'));
```

> You can register as many Action Handlers as you may need to the same Extension.  
> **👉 DON'T PUT EVERYTHING IN THE SAME FUNCTION**

Modularity is gold!

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-v64r4?file=/src/index.js:371-607

---

## The Handler Priority

Sometimes, you just need to be sure that a specific piece of logic runs before or after something else.

> This is mostly the case when 2 services establish some kind of soft-dependencies towards each other.
> We faced this situation while building our [PostgreSQL Connection Service](../howto/my-first-rest-api/080-integrate-services-and-services/README.md),
> and integrating it with the [Fastify Service](https://github.com/forrestjs/forrestjs/tree/master/packages/service-fastify#readme).

Here is a simple example where 2 Features register an Action into the very same Extension. Then they are listed into the App's features in the same order as they are written:

```js
const firstFeature = {
  target: '$INIT_FEATURE',
  handler: () => console.log('Init First Feature'),
};

const secondFeature = {
  target: '$INIT_FEATURE',
  handler: () => console.log('Init Second Feature'),
};

forrestjs.run([firstFeature, secondFeature]);
```

The result of this application would be:

```bash
Init First Feature
Init Second Feature
```

Play with the `priority` option in order to revert the output without changing the listing order:

```js
const firstFeature = {
  target: '$INIT_FEATURE',
  handler: () => console.log('Init First Feature'),
  priority: -1,
};

const secondFeature = {
  target: '$INIT_FEATURE',
  handler: () => console.log('Init Second Feature'),
  priority: 1,
};

forrestjs.run([firstFeature, secondFeature]);
```

The result of this application is now:

```bash
Init Second Feature
Init First Feature
```

The Action Handlers registered to the same Extension are sorted from the higher Priority to the lower. The default Priority is `0` and you can play with this option so to **affect the execution order independently from the listing order**.

> **IMPORTANT:** You shouldn't abuse of this possibility though. **You should always strive to build truly unentangled Services or Features** that don't rely on one another.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-with-priority-yuibn

---

## Action Meta Information

You can pass other options along with your Action using the extended configuration. The info you pass may be used for debugging or tracing purpose by the Service or Feature that creates the Extension.

> There is still a lot of work-in-progress in improving the App isolation and error tracing of Extensions using those Action Meta Information. For now, you can find some examples in this SandBox:

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-options-ey8h0

---

### target [String]

It is the name of the Extension that you want to integrate.

It could be just a plain `string`, but more often than not you will use a formal dictionary of available Extension by simply using the `$` charater at the beginning:

```js
registerAction({
  target: '$INIT_FEATURE',
});
```

In this case `$INIT_FEATURE` is not just a string, but it will be matched against a formal dictionary, verified and translated to the relative string.

👉 Try to misspell it, you will see that the App crashes at boot time.

You can use this feature even if you are not sure that a particular Extension will be available. It's a common scenario when you enable/disable Features at boot time based on feature flags or similar mechanisms.

In such a case, you can use the Optional Target signature:

```js
registerAction({
  target: '$THIS_MAY_NOT_EXISTS?',
});
```

> **NOTE:** Formal targets are all uppercase... just because they look like constants (which they are under the hood). It is just a convention.

### handler [Object, Array, Function]

The Action Handler is often a regular Javascript function that takes 2 arguments:

```js
const actionHandler = (extensionData = {}, appContext = {}) => {};
```

- the Extension's Data is an object with custom data provided by the logic that creates the Extension. Is the way to pass data into the handlers.
- the App Context is the full set of ForrestJS APIs, plus application data or additional APIs that are shared between Features.

### name [String]

### priority [Int]
