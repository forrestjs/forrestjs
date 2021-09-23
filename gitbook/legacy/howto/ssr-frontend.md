# SSR - Frontend

In order to correctly run a server side rendering, you need to provide a
**custom frontend entry point**.

Create `/src/index.ssr.js`:

    import React from 'react'
    import { Provider } from 'react-redux'
    import { createSSRRender } from '@marcopeg/react-ssr/lib/create-ssr-render'
    import { createState } from './state'
    import App from './App'

    const Root = ({ store, ...props }) => (
        <Provider store={store}>
            <App {...props} />
        </Provider>
    )    

    export const staticRender = createSSRRender(Root, { createState })

## What the hell is that?

This is where most of the magic happens. Behind the curtains `createSSRRender` provides
the means to render your application to a simple HTML string.

It will automatially take care of awaiting any asynchronous call that you wrapped with
the `ssr.await()` or `ssr.setTimeout()` methods from the `ssr` reducer, and it is capable
of snapshotting the resulting state so to provide it as `initialState` to your client.

> **SPOILER ALERT:** when we will be adding
> [react-router](https://reacttraining.com/react-router/) we will provide the classic
> router in the client entry point, and the static router here!

