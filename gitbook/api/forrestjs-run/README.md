<h1 class="tutorial-step"><span>ForrestJS API &raquo;</span> ForrestJS.run()</h1>

[ForrestJS API](../README.md) &raquo; [ForrestJS.run()](./README.md)

---

# ForrestJS.run()

## The Philosopy

You can organize your business logic into a _ForrestJS App_ in order to maximize the [Single Responsibility](https://en.wikipedia.org/wiki/Single-responsibility_principle) and [Open/Close](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle) principle. And yes, also to maximize code reusability.

You should divide your source files in two categories:

- Features
- Services

### Features

> A **Feature** is what your customer is willing to pay for.

It's custom made and SHOULD NOT BE SHARED among different Apps.  
It most certainly contains business secrets.

✅ Some examples of _Features_ are:

- A server-side rendered home page
- An endpoint that list your users from a database
- An authentication service that builds JWT tokens

### Services

A **Service** is everything that is irrelevant to your customer, but absolutely needed in order to run your Features.

Services are generic and SHOULD BE REUSABLE across different Apps.  
Services belong to NPM or your private version of it.

✅ Some examples of _Services_ are:

- A function that performs an SQL query towards a DBMS
- An ApolloClient instance that let you fetch from a GraphQL server
- A component library for React (like [MUI](https://mui.com))
- A routing library for React (like [react-router](https://reactrouter.com/))

---

## Quick Start for NodeJS

You can run a simple [Fastify](https://www.fastify.io/) app with custom routing and serve a complex website or REST / GraphQL API:

<iframe src="https://codesandbox.io/embed/service-fastify-th8dq?fontsize=14&hidenavigation=1&theme=dark&view=split&editorsize=70"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="service-fastify"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## Quick Start for React

You can render a React App and use the ForrestJS compositional approach in your frontend.

<iframe src="https://codesandbox.io/embed/react-root-basic-tlo6q?fontsize=14&hidenavigation=1&theme=dark&view=split&editorsize=70"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="service-fastify"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

---

## Intro

A _ForrestJS App_ is heavily inspired to a React app:

- it receives some properties
- it has an internal context
- it has a (boot) lifecycle
- it produces a predictable result

[[TO BE CONTINUED]]

---

## ForrestJS.run() API

### services

```
type:      Array
```

### features

```
type:      Array
```

### settings

```
type:      Object | (async) Function
```

Pass configuration to your running App.

Any key that you set into this object will be available to any Service, Feature, and registered Action via [`getConfig()` API](../app-config/README.md).

Settings can be calculated on the fly by passing an _async Function_ that will receive the full App context (it is indeed just a registed Action):

```js
forrest.run({
  settings: async ({ setConfig }) => {
    // Get remote data:
    const services = await getServiceDiscoveryInfo();

    // Use the API to extend the configuration:
    setConfg('service.discovery.info', services);
  },
});
```

### context

```
type:      Object
```

Add dependencies to your runing App.

Any key that you set into this object will be available to any Service, Feature, and registered Action via [`getContext()` API](../app-context/README.md).

### trace

```
type:      String
value:     "compact" | "full"
```

---

## App Boot Lifecycle in ForrestJS

The Boot Lifecycle is composed by a list of **asynchronous** Extensions created by ForrestJS during the booting of your App.

```js
// Only available to Services
$START            serie
$SETTINGS         serie

// Availabe to Services and Features
$INIT_SERVICES    parallel
$INIT_SERVICE     serie
$INIT_FEATURES    parallel
$INIT_FEATURE     serie

$START_SERVICES   parallel
$START_SERVICE    serie
$START_FEATURES   parallel
$START_FEATURE    serie

$FINISH           serie
```

👉 Each lifecycle Extension provides the App's Context as first parameter into the Action's handler.

```js
registerAction({
  target: '$INIT_FEATURE',
  handler: (ctx) => {
    ctx.getConfig('foo.bar');
  },
});
```

🔥 All the lifecycle Extensions are ASYNCHRONOUS.  
👉 You can use `async/await` in your Action's handlers, or return promises:

```js
// Assuming you are running `service-pg`
registerAction({
  target: '$START_FEATURE',
  handler: async ({ getContext }) => {
    const query = getContext('pg.query');
    await query('SELECT NOW()');
  },
});
```

### Action Execution Order

In the rare case in which you REALLY need to control the execution order of a specific Lifecycle Action, please target the singular Extension: `$INIT_FEATURE`, `$START_SERVICE`.

👉 When you run Actions in `sync`, `serie`, or `waterfall`, the priority makes perfect sense as the Actions are executed one AFTER another.

🔥 When uou run Actions in `parallel`, the priority is only used to set the launch order of the handlers. The execution order is entirely unpredictable for it is asynchronous.
