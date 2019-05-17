# Server Side Rendering

We are finally moving to the core of this project! We are about to render the
whole thing in the server, **sending out a ready to use HTML which renders
instantaneously**, and attaching the client behaviour when the Javasctipt will
be finally downloaded.

There are a couple of steps to go through. It is not complicated at all and I
did my best to lay down a simple path that takes each step in isolation and
explains what it is and how does it contributes to the end goal:

* [Folders structure](./ssr-folders.md)
* [Babel setup (transpiler)](./ssr-babel.md)
* [NPM dependencies](./ssr-npm-dependencies.md)
* [NPM scripts](./ssr-npm-scripts.md)
* [the frontend script](./ssr-frontend.md)
* [the frontend script](./ssr-frontend.md)
* [the backend script](./ssr-backend.md)
* [the kickoff scripts](./ssr-kickoff.md)
* [code splitting](./ssr-code-splitting.md)

## Tutorial Codebase

By undertaking this tutorial (~5 minutes of your time) you will build a simple web
page **that renders in the server first**. We will continute from the
[client tutorial](./app.md) so make sure you went through that or that you have
downloaded the codebase.

You will find every single line of code in the following pages, nothing is left out,
but if you are very courious and decide that you simply want to run it then
[download the boilerplate](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-universal.zip).

## Tooling

- NPM scripts
- Nodemon
- Babel
- ExpressJS
