# SSR - Babel Setup (transpiler)

Create `/.babelrc`:

    {
        "presets": [
            "@babel/preset-env",
            "@babel/preset-react"
        ],
        "plugins": [
            "babel-plugin-dynamic-import-node-babel-7",
            "react-loadable/babel"
        ],
        "env": {
            "node": {
                "plugins": [
                    [
                        "babel-plugin-transform-require-ignore",
                        { "extensions": [ ".css", ".less", ".sass", ".styl" ] }
                    ]
                ]
            }
        }
    }
    
### why Babel?

With SSR we render React in our Node app, that means that we need to transpile
some part of our client codebase. For sure we need to transpile JSX, but you might
have in place some weird thing in Webpack as well, and Babel would have to take
care of that.

> For instance, is not uncommon for React apps to use ES6 `class` syntax, likely
> in combination with `class properties`.

In a normal NodeJS project I would suggest not to implement fancy transpile layers
as with Node 10.x came a good deal of new supported syntaxes. But as we are going to 
merge client and server, in this tutorial I'm going to fully use ES6 and Javascript 
modules (import/export) and that means that I need to transpile some stuff. 

The main tool is [Babel]() with some plugins applied to it. Babel is going to be
responsible for translating our ES6 app into NodeJS.

