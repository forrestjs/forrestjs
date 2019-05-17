## SSR - Backend

You have almost certainly noticed that in our `NPM scripts` that are supposed to
kickoff the app we refer to two possible entry points: `/index.js` and `/index.dev.js`.

We are going to write those files in the next step, but long story short they will
do very little logic. They are basically necessary for transpiling purposes only.

What we really need is a single entry point that spins up all the services that
concour in making our app unique and available.

## /ssr/boot.js

Right now we just need a simple ExpressJS server that implements the `react-ssr`
easy to use middleware. So go ahead and create the scaffold of such file 
in `ssr/boot.js`:

    import express from 'express'
    import createSSRRouter from '@marcopeg/react-ssr/lib/create-ssr-router'

    // polyfill "fetch" in NodeJS
    require('es6-promise').polyfill();
    require('isomorphic-fetch');

    export default async () => {
        const app = express()
        app.use(createSSRRouter())
        app.listen(8080)
    }

## What Is that it?

Hell no! (but you figured this out already, right?) This is just the
**bare minimum code for our app to boot** and process a simple server side rendering
request correctly.

In a real-life app you may need to set up database connections, sockets, different
services that might offer pub/sub fancy stuff.

But for what concern this simple tutorial, we just want to get things done and
perform a simple SSR of the app that we prepared already.

