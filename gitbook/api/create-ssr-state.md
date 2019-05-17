# API - createSSRState

Use this method to create a `redux store` factory function:

    const createStore = createSSRState(reducers, features, settings)
    const reduxStore = createStore(initialState, history)

    reduxStore.dispatch(...)

> It is important that the store gets generated in a
> [closure](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)
> because of the shared nature of the NodeJS thread.
>
> This technique allow **different SSR requests to scope their state** correctly.

## Capabilities

* Asynchronous actions with [redux-thunks](https://www.npmjs.com/package/redux-thunk)
* [React features](https://www.npmjs.com/package/react-redux-feature):
   more info [here](../howto/features.md)
* [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)
* [SSR Context Reducer](./create-ssr-context.md)

## Arguments

All the arguments are optional, but an app wouldn't make much sense without them.

### reducers

    {
        foo: state => state + 1,
        fii: (state = {}, action) => { ... },
    }

List of reducers that you want to enable.

### features

    [
        {
            reducers: {},
            services: [],
            listeners: [],
        },
        ...
    ]

List of features that you want to enable.

### initialState

    {
        foo: 0,
    }

Well... the initial state, right?

### history

An instance of the [history](https://www.npmjs.com/package/history) module to be used
in combination with the `react-router` middleware and `redux-events-middleware`.

## settings

### globalStoreName

If `NODE_ENV === development` the Redux DevTools are enabled by default, plus the store
is exposed in the global scope as `window[settings.globalStoreName]` for debugging
purposes. Of course all of this is disabled in the server and production.

Default value: `store`

### out

Allows to manipulate the components of the state before they are sent back to the app.
By instance you can use this method to synchronize `react-router` with `redux`.

### prependMiddlewares

### appendMiddlewares

### buildMiddlewares

### prependEnhancers

### appendEnhancers

### buildEnhancers

### appendReducers
