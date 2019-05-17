# SSR - NPM Scripts

Our setup is getting a little bit more complex than just a client application.
We have the client process, server process, dev and prod mode, building stuff...

I don't really like the idea of keeping every CLI instructions in my brain and
I believe that [NPM Scripts](https://docs.npmjs.com/misc/scripts) are a simple and
elegant tool to document how to work, test and run our application:

Edit `/package.json`:

    ...

    "scripts": {
        "start": "react-scripts start",
        "build": "react-scripts build",
        "test": "react-scripts test",
        "eject": "react-scripts eject",
        "----- // SSR CLEAN // -----": "",
        "clean:build:app": "rm -rf build",
        "clean:build:src": "rm -rf ./build-src",
        "clean:build:ssr": "rm -rf ./build-ssr",
        "clean:all": "npm run clean:build:app && npm run clean:build:src && npm run clean:build:ssr",
        "----- // SSR BUILD // -----": "",
        "build:src": "NODE_ENV=production ./node_modules/.bin/babel src --out-dir . build-src --copy-files",
        "build:ssr": "NODE_ENV=production ./node_modules/.bin/babel ssr --out-dir ./build-ssr",
        "build:node": "npm run build:src && npm run build:ssr",
        "build:all": "npm run build && npm run build:node",
        "----- // SSR START // -----": "",
        "start:dev": "NODE_ENV=development nodemon index.dev.js",
        "start:dev:api": "NODE_ENV=development nodemon --watch ssr -e js index.dev.js",
        "start:prod": "npm run clean:all && npm run build:all && npm run start:prod:api",
        "start:prod:api": "NODE_ENV=production node index"
    },

    ...

**IMPORTANT:** Almonst none of those scripts will work correctly until you complete all
the steps in the `Server Side Rendering` tutorial. Just bear with me few more minutes and
everything will fall into the right place :-)

## Start Scripts

This section contains the "how to run it".

### Development

`npm run start:dev` will start the SSR process in development mode, the server uses
[nodemon](https://nodemon.io/) for live reload it's process on file changes occour in
both `/src` and `/ssr` folder.

`npm run start:dev:api` is similar but skips reloading on changes in `/src`. I often use
this when I'm heavily working on the API layer of my app. Actually I usually work with
two terminal sessions:

- `npm start`: runs the webpack process
- `npm run start:dev:api`: run the API layer

### Production

`npm run start:prod` will prepare and run your application in production mode. By saying
"build" I mean both the "cleanup" and "build" steps that we can see underneath.

`npm run start:prod:api` will simply start the node process from the production
artifacts. This assumes that you have already built the entire app. I often use this
start script inside my Docker containers.

## Build Scripts

There are three stuff that need to be built/transpiled for the production mode to work
correctly:

- client bundels: `npm run build` or `npm run build:app`
- client sources: `npm run build:src`
- server sources: `npm run build:ssr`

More often than not you want to run all of them:

    npm run build:all

## Clean Scripts

Those are to cleanup the artifacts.

    npm run clean:all

