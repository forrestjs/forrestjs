// @TODO: this guy has a similar project, with the same problem
// https://github.com/andreiduca/cra-ssr-code-splitting/issues/7
// (seems solved with "chunks:initial")

import { ReactLoadablePlugin } from  'react-loadable/webpack'

export const webpackReactLoadable = (config, settings = {}) => {
    // it's possible to skip the plugin as with CRA there is already a
    // "asset-manifest.json" that SSR can use to map dynamically loaded bundles.
    if (settings.skipPlugin !== true) {
        config.plugins = [
            ...config.plugins,
            new ReactLoadablePlugin({
                filename: settings.target || './build/react-loadable.json',
            }),
        ]
    }
    
    // "chunks:all" generates some unpredictable chunks based on "node_modules"
    // that are not detected by "react-loadable", hence will cause some flickering
    // in the rendering because the chunk itself is not going to be places into
    // the initial HTML rendering.
    config.optimization = {
        ...config.optimization,
        splitChunks: { chunks: 'initial' },
    }

    return config
}

export default webpackReactLoadable
