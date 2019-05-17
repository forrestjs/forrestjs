# @ForrestJS - React Universal Apps

Hey mate, thank you for landing here!

> ForrestJS helps you to setup a 
> **universal progressive web application**
> based on the NodeJS/React stack.

[.: Read the full documentation here :.](https://forrestjs.github.io)

## Try out a Universal app very quikly

Create a new universal app from the standard boilerplate:
(it's going to take a minute to install the dependencies)

    npx forrest run my-new-ssr-app

This is going to take a minute to install all the dependencies and build
the project, plus you need NodeJS 10.x or greater. But don't worry

Go to [http://localhost:8080](http://localhost:8080) and see it in action!

## What you get

- React/Redux store ready for ssr, yes, with built-in server memory scope
- SSR rendering loop that handles any kind of asynchronous rendering need
- SEO Optimization, thanks to `react-helmet`)
- Code splitting that works in the server, thanks to `react-loadable`)
- Fully customizable cache layer that supports sessions out of the box
- A lot of free space for customization

## Spoiler Alert

This is one of the many **opinionated setup** available on the web. It's mine,
my own, my precious... No kidding, this is how I believe a modern web app
can be organized to **maximize productivity** and improve **developer's experience**.

Although this is by all means my own understanding of the `ssr` challenge, I did
my best to use only existing and well known open source projects, and **limited my
own code to the bare minimum**.

I also cared of placing extension points all around. It's your choice to 
**just use it**, or you can finely configure how stuff work and make it perfect
to your own needs.

## Still building...

This package is quite stable. Yet, I'm till actively working on it and you can
expect new features and **slight changes in the apis**.

Nevertheless I'm already using it in production, and I know few friends who are
trusting _ForrestJS_ (and me, thanks mates 🙏) for their projects in production.

I commit to do my best in preserving backward compatibility and keep it up-to-date
with new versions of the few dependencies that we use.

WANNA HELP ME?  

## You should know...

I wrote this documentation for a mid-experienced engineer.

The code is all here in this pages and you can basically move step by step, 
and copy-paste to get the examples running. Plus at the end of each chapter you
will find a link to a working boilerplate that you can download and run.

> We tested this documentation quite well, but bugs will always to be found!
> Please report it in the issues.

Let' cut it short; here is the list of the things that you should be already
aquainted with:

- Javascript in general, ES6 in particular
- NodeJS, NPM, Yarn
- ExpressJS (or similar middleware based tool)
- ReactJS (recent version)
- Webpack/Babel

I don't expect you to be an expert on all those tools, but it would be so good if
you have a basic understanding of how to use them.

## Table of Contents

* [Introduction](README.md)
* [give us a star on GitHub!](https://github.com/forrestjs/forrestjs)
* [install from NPM](https://www.npmjs.com/package/forrest)

### Articles

* [Reducers](./articles/reducers.md)
* [Services](./articles/services.md)
* [SSR with Styled Components](./articles/styled-components.md)

### Other Stuff

* [Development](./DEVELOPMENT.md)

## LICENCE

Copyright 2019 Marco Pegoraro

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
