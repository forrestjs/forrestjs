# Customize ESLint

This tutorial is mostly related to `create-react-app` users. If you take care of your
own Webpack configuration I'm sure that you know exactly how to setup `eslint`.

### Intro

There are a lot of buzz and fuzz in the `CRA` repo on GitHub about extending the basic
eslint configuration. It looks like they really want to stick to a plain "no" which is
quite beyond my ability to understand it... all the rest is so good!

Anyway, in the [setup](./setup.md) tutorial I asked you to create your demo project with
this instruction:

    npx create-react-app cra-ssr --scripts-version react-scripts-rewired

This will use a customized version of `react-scripts` provided by
[react-scripts-rewired](https://www.npmjs.com/package/react-scripts-rewired) 
(disclaimer: I'm behind that too). Simply put it allows you to hook into the project
setup and customize what you like.

## Where to start?

This tutorial assumes that you went through the [seo tutorial](./seo.md)
and have a fully working app. You can always download the ready to use boilerplate
[here](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-seo.zip).

### Let's do it!

**Step n.1** - create `/.eslintrc` file and put your own rules. This is mine:

    {
        "extends": [
            "react-app",
            "react"
        ],
        "settings": {
            "import/resolver": {
                "node": {
                    "paths": [
                        "./src",
                        "./services/webapp/src"
                    ],
                    "extensions": [
                        ".js",
                        ".jsx"
                    ]
                }
            }
        },
        "rules": {
            "semi": [
                "error",
                "never"
            ],
            "indent": [ 2, 4, { "SwitchCase": 1 } ],
            "operator-linebreak": ["error", "before"],
            "comma-dangle": [ "error", "always-multiline" ],
            "quote-props": [ "error", "as-needed" ],
            "array-bracket-spacing": ["error", "always", { "singleValue": false }],
            "new-cap": [ 2, { "capIsNewExceptions": [ "express.Router" ] }],
            "import/no-unresolved": [ 0 ],
            "react/require-default-props": [ 2 ],
            "react/prefer-stateless-function": [ 2, { "ignorePureComponents": true } ],
            "prefer-reflect": [ 0 ]
        }
    }



**Step n.2** - install new dependencies

> This step may variate based on your own `.babelrc` content!

    npm install --save-dev \
        eslint-config-react

**Step n.3** - rewire es lint in `/webpack.config.extend.js`:

    const rewireEslint = require('react-scripts-rewired/lib/rewire-eslint')
    const { webpackReactLoadable } = require('@marcopeg/react-ssr/lib/webpack-react-loadable')

    module.exports = config => {
        config = webpackReactLoadable(config)
        config = rewireEslint(config)
        return config
    }

## Test & Fix

If you try now to build the project you will surely encounter a long long list
of linting errors. You can fix them yourself or you can just download the final
boilerplate at the end of this lesson.

As suggestion, you can also add a custom NPM script for the linting:

    "scripts": {
      ...
      "lint": "./node_modules/.bin/eslint .",

This will actually run the linting on any javascript file, it is wise to add a
`/.eslintignore` with some ground rules:

    node_modules
    build
    build-src
    build-ssr

## Tutorial Codebase

As always, you can [download the boilerplate](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-eslint.zip).
where you will find all the files discussed in this page.
