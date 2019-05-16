import path from 'path'
import readSourceFile from './read-source-file'
import { getBundles } from 'react-loadable/webpack'

export default async (settings, modules) => {
    if (settings.disableJs === 'yes') {
        return {
            js: [],
            css: [],
        }
    }

    const loadableBundleStatsPath = path.join(settings.build, 'react-loadable.json')
    const craBundleStatsPath = path.join(settings.build, 'asset-manifest.json')
    
    let loadableBundleStats = false
    let craBundleStats = false
    try { loadableBundleStats = await readSourceFile(loadableBundleStatsPath, true) } catch (err) {}
    try { craBundleStats = await readSourceFile(craBundleStatsPath, true) } catch (err) {}

    let allBundles = false

    // generate assets map with the ReactLoadable bundles stats
    if (loadableBundleStats !== false) {
        try {
            allBundles = getBundles(loadableBundleStats, modules)
        } catch (err) {
            console.log(`[ssr] "react-loadable.json" bundles stats failed - ${err.message}`)
        }
    }

    // use basic CRA's "asset-manifest.json"
    if (allBundles === false && craBundleStats !== false) {
        try {
            allBundles = Object.keys(craBundleStats)
                .filter((bundleName) => modules
                    .map(moduleName => moduleName.replace('./', ''))
                    .some((moduleName) => (
                        bundleName.indexOf(`${moduleName}.js`) !== -1 ||
                        bundleName.indexOf(`${moduleName}.css`) !== -1
                    )))
                .map((bundleName) => ({
                    bundleName,
                    file: craBundleStats[bundleName],
                    publicPath: craBundleStats[bundleName],
                }))
        } catch (err) {
            console.log(`[ssr] "asset-manifest.json" bundles stats failed - ${err.message}`)
        }
    }

    // map bundles to assets files
    if (allBundles !== false) {
        return {
            js: (
                allBundles
                    .filter(bundle => bundle.file.indexOf('.js') !== -1)  // target js
                    .filter(bundle => bundle.file.indexOf('.map') === -1) // remove maps
                    .map(bundle => `<script type="text/javascript" src="${bundle.publicPath}"></script>`)
            ),
            css: (
                allBundles
                    .filter(bundle => bundle.file.indexOf('.css') !== -1) // target css
                    .filter(bundle => bundle.file.indexOf('.map') === -1) // remove maps
                    .map(bundle => `<link href="${bundle.publicPath}" rel="stylesheet">`)
            ),
        }
    }

    console.log('[ssr] warning - it was not possible to produce the assets bundles mapping!')

    return {
        js: [],
        css: [],
    }
}
