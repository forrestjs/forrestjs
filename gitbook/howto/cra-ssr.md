# Create React App Universal

In this step-by-step tutorial you are going to take a **Create React App**
boilerplate, and turn it into a fully featured Universal PWA with 
**Server Side Rendering**, a GraphQL API, code splitting and routing.

**NOTE:** If you just want to enjoy a ready-to-use setup type:

      npx forrest run cra-ssr -p 8080

### Step n.1

The entire set of examples assume that you are going to use
[create-react-app](https://facebook.github.io/create-react-app/)
as boilerplate for you application, so the first step would be to initialize a new
CRA project (*):

    npx create-react-app cra-ssr

### Step n.2

Now you can `cd` into your project and install some `ForrestJS` modules:

    cd cra-ssr
    yarn add @forrestjs/package-universal
    yarn add @forrestjs/package-universal-dev -D

## NPM Scripts

So far we just installed dependencies so the basic scripts that were created by
`create-react-app` are in place with their default behaviour.

**This will not change during the course of this tutorial :-)**

I really like the idea of having a common ground in `create-react-app` (even if I
don't share all the decisions they made!) and I did my best to provide a simple
way to enrich that basic ground without breaking it.

With all that said, you can spin up your app:

      npm start

![npm start](../images/react-ssr__start.png)

## Let's Server Side Render!

In order to implement SSR with ForrestJS you are going to need 3 things:

1. A Sever Side entry point for your app
2. A NodeJS server - we'll use ExpressJS
3. Some @babel support for our server side code (I love ES6, you?)

### Server Side Entry Point

Create `src/index.ssr.js`:

```js
import { createSSRRender } from '@forrestjs/core/lib/create-ssr-render'

// project specific modules
import App from './App'
import './index.css'

export const staticRender = createSSRRender(App)
```

### Modular NodeJS Server

Create `server.js`:

```js
// Makes NodeJS understand ES6
process.env.NODE_ENV = 'development'
require('@babel/polyfill')
require('@babel/register')

// List our server capabilities
const services = [
    require('@forrestjs/service-express'),
    require('@forrestjs/service-express-ssr'),
]

// Start the app
require('@forrestjs/hooks')
    .createHookApp({ services })()
    .catch(err => console.log(err.message))
```

### Babel up and go!

Edit `package.json`:

```json
"babel": {
  "presets": [
    "@forrestjs/babel-preset-universal"
  ]
},
"scripts": {
    "serve": "yarn build && node server.js",
    ...
}
```

And run:

    yarn serve

You should now be enjoying a Server Side Rendered Create React App (or `SSRCRA` fo the whom who
like acronyms :-).

It looks exactly like the client side rendered that you get with `yarn start`, but it's
server-side rendered. You can look at the page's source and spot some content within the HTML.


## (*) react-scripts-rewired

Most of the examples work with the default setup, but when it comes to
the **server side rendering of an application that implements code splitting** with
[react-loadable](https://github.com/jamiebuilds/react-loadable) you are goint to
need to make a small fix to the default [Webpack](https://webpack.js.org/) configuration.

I usually use [react-scripts-rewired](https://www.npmjs.com/package/react-scripts-rewired)
which implements a light extension of the default `react-scripts` package and allows
our project to extend the default configuration:

    npx create-react-app cra-ssr --scripts-version react-scripts-rewired

If you have already created your app, you should simply switch from

    "react-scripts": "3.0.1"

to:

    "react-scripts-rewired": "3.0.1--latest1",

(`react-scripts-rewired` follows (give or take) the same version of `react-scripts`)