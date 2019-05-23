# Forrest CLI

Forrest helps you run Universal PWAs based on ExpressJS / Create React App.

## Quick Start

We love [GatsbyJS](https://www.gatsbyjs.org/) for building static websites and
we took inspiration from that for the CLI interface:

    # Create a brand new Universal PWA:
    npx forrest run forrest-site -p 8080

You can optionally install Forrest as global package:

    npm install -g forrest

## `run` Options

The `run` command executes a Forrest project (and creates it if it doesn't exists).

    npx forrest run [project_name, ...options]

The `project_name` is optional because you can use Forrest from within a project
cwd omitting it's name, or from outside with a given name.

#### Development Mode

By default the project runs in **production mode** but you can also run the
**development mode** using the `-d` flag:

    npx forrest run -d

#### Custom Port

Forrest's starters use to run on 8080 and observe a `PORT` or `REACT_APP_PORT` environment
variable to customize this setting. From the CLI you can use the `-p` flag:

    npx forrest run -p 7777

    or

    npx forrest run --port=7777

## Starters

Forrest comes with some starter projects. A "starter" is a boilerplate that implements
some functionality that you might be interest into.

You can specify which starter you want to use with the `-t` option:

    npx forrest new forrest-site -t johndoe/forrest-starter-xxx

This will simply try to clone from a GitHub repository "forrest-starter-xxx" hosted by the
"johndoe" user.

**Yes, you can easily create your custom starters** and make them available
as public GitHub repositories. Please fork this repo and list them here in the `README.md`,
then run a _Pull Request_.

#### forrest-starter-universal (default)

https://github.com/forrestjs/starter-universal

- CRA
- SSR
- Redux
- React Router
- React Loadable
- ExpressJS
- GraphQL
- Unit Testing (Jest)
- Styleguide
- Gitbook
- circle-ci

## Running ForrestJS on Windows

We strongly suggest you take a look and download the 
[Git Cmd](https://git-scm.com/download/win) for Windows.

ForrestJS works with that tool :-)

## Licence

Copyright 2019 Marco Pegoraro

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


