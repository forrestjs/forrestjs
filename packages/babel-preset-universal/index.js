const r = require(`./resolver`)
const nodeEnvFile = require('node-env-file')

// Load project's `.env*` files
nodeEnvFile(path.join(process.cwd(), '.env'), { overwrite: false, throw: false })
nodeEnvFile(path.join(process.cwd(), '.env.local'), { overwrite: true, throw: false })
nodeEnvFile(path.join(process.cwd(), `.env.${process.env.NODE_ENV}`), { overwrite: true, throw: false })
nodeEnvFile(path.join(process.cwd(), `.env.${process.env.NODE_ENV}.local`), { overwrite: true, throw: false })

const BUILD_LOCALE = process.env.REACT_SSR_BUILD_LOCALE || 'build-locale'

function preset(_, options = {}) {
    const { debug = false } = options
    const { NODE_ENV, BABEL_ENV } = process.env

    const PRODUCTION = (BABEL_ENV || NODE_ENV) === `production`

    return {
        presets: [
            [
                r(`@babel/preset-env`),
                Object.assign(
                    {
                        loose: true,
                        debug: !!debug,
                        useBuiltIns: false,
                        shippedProposals: true,
                        modules: `commonjs`,
                        targets: {
                            browsers: PRODUCTION
                                ? [`last 4 versions`, `safari >= 7`, `ie >= 9`]
                                : [`last 2 versions`, `not ie <= 11`, `not android 4.4.3`],
                        },
                    }
                ),
            ],
            [r(`@babel/preset-react`), { development: !PRODUCTION }],
            r(`@babel/preset-flow`),
        ],
        plugins: [
            r(`@babel/plugin-proposal-class-properties`),
            // r(`@babel/plugin-proposal-optional-chaining`),
            // r(`@babel/plugin-transform-runtime`),
            // r(`@babel/plugin-syntax-dynamic-import`),
            r(`babel-plugin-dynamic-import-node-babel-7`),
            [
                r(`babel-plugin-module-resolver`),
                {
                    root: [ 'src', 'ssr', '.' ],
                },
            ],
            r(`react-loadable/babel`),
            r(`babel-plugin-styled-components`),
            [
                r(`babel-plugin-react-intl`),
                {
                    messagesDir: `./${BUILD_LOCALE}`,
                },
            ],
        ],
        env: {
            node: {
                plugins: [
                    [
                        r(`babel-plugin-transform-require-ignore`),
                        {
                            'extensions': [ '.css', '.less', '.sass', '.styl' ],
                        },
                    ],
                ],
            },
        },
    }
}

module.exports = preset
