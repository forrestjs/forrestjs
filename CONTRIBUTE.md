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

## Monorepo

- high level scripts
- babel stuff
- dev dependencies
- feature-xxx
  - README.md
  - package.json
  - src
  - __build

A "feature" (or NPM deployable) has a package json that tracks the version number
and the direct dependencies to be installed upon adoption.

The build script for each feature must:
1. transpile /src into __build
2. copy (or replace) README.md
3. copy (or replace) package.json

The release script for each feature must:
1. bump the version number of the target package.json
2. build
3. npm publish from the feature's cwd

