# Development

Forks and Pull Requests are welcome!

[[ TO BE COMPLETED ]]

## Build to a target project

This is useful if you want to transpile the source code (and watch it) to a
specific project that you are working on:

    TARGET=~/dev/marcopeg/react-ssr/examples_dev/008-hooks/ npm run start:to

Why?? 

Well, initially I used to `npm link` but there are quite a few issues with
the dependencies and multiple copies of React being involved in the SSR process.

By transpiling the code directly into the project's `node_modules` everything
works just fine.
