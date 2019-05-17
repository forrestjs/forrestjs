/**
 * Project's customized Webpack Configuration Extension
 * ----------------------------------------------------
 *
 * this file is heavily inspired by `react-app-rewired` mechanism.
 *
 * it simply gives you the chance to hook into the default Webpack
 * configuration as it is provided by `create-react-app`, and to
 * change it so to match your project's needs.
 *
 * If you want to check out the default values look into:
 * `./node_modules/marcopeg-react-scripts/config/webpack.config.${env}.js`
 *
 */

const rewireEslint = require('react-scripts-rewired/lib/rewire-eslint')
const { webpackReactLoadable } = require('@marcopeg/react-ssr/lib/webpack-react-loadable')

module.exports = config => {
    config = webpackReactLoadable(config)
    config = rewireEslint(config)
    return config
}

