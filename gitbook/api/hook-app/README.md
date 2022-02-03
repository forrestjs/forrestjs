# Hook App

## The Philosopy

You can organize your business logic into a _Hook App_ in order to maximize the [Single Responsibility](https://en.wikipedia.org/wiki/Single-responsibility_principle) and [Open/Close](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle) principle.

You divide your codebase in 2 categories:

- Features
- Services

### Features

A **Feature** is what your customer gives you money to build. It's custom made and should not be shared among different Apps. It most certainly contains business secrets.

✅ Some examples of _Features_ are:

- A home page
- An endpoint that list your App's users
- An authentication service that builds JWT tokens

### Services

A **Service** is everything that is irrelevant to your customer, but needed in order to run an App. They are generic and should be reusable across different Apps.

✅ Some examples of _Services_ are:

- A function that performs an SQL query towards a DBMS
- An ApolloClient instance that let you fetch from a GraphQL server
- A components library for React (like [MUI](https://mui.com))
- A routing library for React (like [react-router](https://reactrouter.com/))

## Quick Start for NodeJS

You can run a simple [Fastify](https://www.fastify.io/) app with custom routing and serve a complex website or REST / GraphQL API:

<iframe src="https://codesandbox.io/embed/service-fastify-th8dq?fontsize=14&hidenavigation=1&theme=dark&view=split&editorsize=70"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="service-fastify"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Quick Start for React

You can render a React App and use the ForrestJS compositional approach in your frontend.

<iframe src="https://codesandbox.io/embed/react-root-basic-tlo6q?fontsize=14&hidenavigation=1&theme=dark&view=split&editorsize=70"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="service-fastify"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Intro

The _Hook App_ is heavily inspired to a React app:

- it receives some properties
- it has an internal context
- it has a lifecycle

## Lifecycle Hooks

### $INIT_SERVICE(S)

### $INIT_FEATURE(S)

### $START_SERVICE(S)

### $START_FEATURE(S)
