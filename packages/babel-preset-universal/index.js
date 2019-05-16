const r = require(`./resolver`)

function preset(context, options = {}) {
    const { browser = false, debug = false } = options
    const { NODE_ENV, BABEL_ENV } = process.env

    const PRODUCTION = (BABEL_ENV || NODE_ENV) === `production`

    const browserConfig = {
        useBuiltIns: false,
        targets: {
            browsers: PRODUCTION
                ? [`last 4 versions`, `safari >= 7`, `ie >= 9`]
                : [`last 2 versions`, `not ie <= 11`, `not android 4.4.3`],
        },
    }

    const nodeConfig = {
        corejs: '3.0.0',
        targets: {
            node: PRODUCTION ? 6.0 : `current`,
        },
    }

    return {
        presets: [
            [
                r(`@babel/preset-env`),
                Object.assign(
                    {
                        loose: true,
                        debug: !!debug,
                        useBuiltIns: `entry`,
                        shippedProposals: true,
                        modules: `commonjs`,
                    },
                    browser ? browserConfig : nodeConfig
                ),
            ],
            [r(`@babel/preset-react`), { development: !PRODUCTION }],
            r(`@babel/preset-flow`),
        ],
        // plugins: [
        //     r(`@babel/plugin-proposal-class-properties`),
        //     r(`@babel/plugin-proposal-optional-chaining`),
        //     r(`@babel/plugin-transform-runtime`),
        //     r(`@babel/plugin-syntax-dynamic-import`),
        //     [
        //         r(`babel-plugin-module-resolver`),
        //         {
        //             root: [ 'src', 'ssr', '.' ],
        //         },
        //     ],
        //     r(`react-loadable/babel`),
        //     r(`babel-plugin-styled-components`),
        //     [
        //         r(`babel-plugin-react-intl`),
        //         {
        //             messagesDir: './build-locale/messages/',
        //         },
        //     ],
        // ],
        // env: {
        //     node: {
        //         plugins: [
        //             [
        //                 r(`babel-plugin-transform-require-ignore`),
        //                 {
        //                     'extensions': [ '.css', '.less', '.sass', '.styl' ],
        //                 },
        //             ],
        //         ],
        //     },
        // },
    }
}

module.exports = preset
