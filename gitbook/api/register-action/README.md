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

🧐 The piece of code above just writes a `console.log` App's Boot Lifecycle. It's not much, but it is already a viable piece of _business logic_.

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-v64r4?file=/src/index.js:118-222

---

## Register Multiple Handlers

A ForrestJS' Extension is just a **named pointer** to a list of Action handlers.  
_They are just regular JavaScript functions, really._

Every time you register an Action, you simply add yet another handler to the Extension's list.

```js
registerAction({
  target: '$INIT_FEATURE',
  handler: () => console.log('Handler #1'),
});

registerAction({
  target: '$INIT_FEATURE',
  handler: () => console.log('Handler #2'),
});
```

> You can register multiple Action Handlers to the same Extension.  
> **👉 DON'T PUT EVERYTHING IN THE SAME FUNCTION**

Modularity is gold!

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-v64r4?file=/src/index.js:226-400

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

forrestjs.run({ features: [firstFeature, secondFeature] });
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

forrestjs.run({ features: [firstFeature, secondFeature] });
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

You can pass other options along with your Action's `target` and `handler`.

The info you pass may be used for debugging or tracing purpose by the Service or Feature that creates the Extension.

> There is still a lot of work-in-progress in improving the App isolation and error tracing of Extensions using those Action Meta Information. For now, you can find some examples in this SandBox:

---

**💻 Live on CodeSandbox:**  
https://codesandbox.io/s/register-action-options-ey8h0

---

### target

```
type:    String
```

It is the name of the Extension that you want to integrate into.

It could be just a plain `string`, but usually you will **use a formal dictionary** of available Extensions by simply using the `$` prefix:

```js
registerAction({
  target: '$INIT_FEATURE',
});
```

In this case `$INIT_FEATURE` is not just a string, but it will be matched against a formal dictionary, verified, and translated to the absolute Extension name string.

👉 Try to misspell it, you will see that the App crashes at boot time.

You can use this feature even if you are not sure that a particular Extension will be available. It's a common scenario when you enable/disable Features at boot time based on feature flags or similar mechanisms.

In such a case, you can use the Optional Target signature:

```js
registerAction({
  target: '$THIS_MAY_NOT_EXISTS?',
});
```

> **NOTE:** Formal targets are all uppercase... just because they look like constants (which they are under the hood). It is just a convention.

### handler

```
type:    Function | Array | Object
```

The Action Handler is often a regular JavaScript function that takes 2 arguments:

```js
const actionHandler = (extensionContext = {}, appContext = {}) => {};
```

- the Extension's Context is an object with custom data and API provided by the logic that creates the Extension. Is the Extension's way to pass parameters to the Action handlers.
- the App Context is the full set of ForrestJS APIs, plus application data or additional APIs that are shared by Services and Features.

### name

```
type:    String
```

The Action's Name gives a logical identification of the Action inside the App.

When you pack Actions as Features or Services with a **functional Manifest**, the Action's name is defaulted to the Manifest's name.

### priority

```
type:    Integer
default: 0
```

It set the execution order of the Action handlers that are registered to an Extension.

### trace

```
type:    Any
```

It's an arbitrary information that will be returned into any Error generated by the Action Handler. I ususally set it to `__filename` because errors in JavaScript suck.
