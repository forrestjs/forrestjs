import path from 'path'
import { Helmet } from 'react-helmet'
import mapModulesToBundles from './map-modules-to-bundles'
import readSourceFile from './read-source-file'
import prepHTML from './prep-html'
import * as cache from './memcached'
import ssrVersion from './current-version'

/**
 * Settings:
 * - root (string) - client app source folder absolute path
 * - build (string) - client app build folder absolute path
 * - port: (string) - ssr server port for default api calls
 * - renderTimeout: (int) - rendering timeout in milliseconds
 * - renderLimit: (int) - max amount of rerendering waiting for async calls to resolve
 * - disableJs: (string)[yes|no]
 * - nodeEnv: (string)[development|production]
 */
let staticRender = null
export const serveAppSSR = (settings = {}) => async (req, res, next) => {
    // try to access memcached record
    if (settings.useCache === 'yes') {
        try {
            const cachedHTML = await cache.get(req, res)
            if (typeof cachedHTML === 'string') {
                console.log(`[ssr] (cached) ${req.url}`)
                return res.send(cachedHTML)
            }
        } catch (err) {
            console.log(`[ssr] read cache error for "${req.url}" - ${err.message}`)
        }
    }

    try {
        console.log(`[ssr] ${req.url}`)

        // try to import the staticRender function from the app's source code
        if (!staticRender) {
            try {
                // pick the ssr entrypoint from `/src` (dev) or `/build-src` (prod)
                const src = process.env.NODE_ENV === 'production' ? settings.buildSrc : settings.src
                staticRender = require(path.join(settings.root, src, settings.entryPoint)).staticRender

                if (!staticRender) { // eslint-disable-line
                    throw new Error('ssr static render was not provided')
                }
                if (typeof staticRender !== 'function') {
                    throw new Error('ssr static render does not appear to be a function')
                }
                if (staticRender.ssrVersion !== ssrVersion) {
                    throw new Error('ssr static render version signature does not appear to match')
                }
            } catch (err) {
                console.error(`[ssr] ${err.message}`)
                console.log(err)

                // fallback on a default static render that will visualize the error
                staticRender = (() => ({
                    html: err.message,
                    initialState: {},
                    context: {},
                }))
            }
        }

        // try to fetch the app HTML entry point, in case there is none available
        // it will provide some useful suggestions if in development
        let htmlTemplate = null
        const filePath = path.resolve(path.join(settings.build, 'index.html'))
        try {
            htmlTemplate = await readSourceFile(filePath)
        } catch (err) {
            console.log('')
            console.log('')
            console.log('=== react-ssr ===')
            console.log('missing entry point:')
            console.log(filePath)
            console.log('')
            console.log('In order to run SSR you need to build the project artifacts:')
            console.log('   npm run build:all')
            console.log('')
            console.log('=================')
            console.log('')
            console.log('')

            if (req.url === '/' && process.env.NODE_ENV !== 'production') {
                res.send('[ssr] Application entrypoint not found, more info in the logs.')
                return
            } else {
                return next()
            }
        }

        const initialState = await settings.makeSSRInitialState({
            ...settings.initialState,
            ssr: {
                req, res,   // proxy express handlers,
                            //used to forward headers and cookies during ssr

                // during ssr we need a default loopback.
                // with settings we can configure for extarnal backends
                rootUrl: settings.rootUrl || `http://localhost:${settings.port}`,
                apiUrl: settings.apiUrl || `http://localhost:${settings.port}/api`,
            },
        }, { req, res, next })

        // dynamically decide whether to render a route or not
        const shouldRender = settings.shouldRender 
            ? await settings.shouldRender(req, res)
            : true

        const prerender = shouldRender
            ? await staticRender(req.url, initialState, {
                req, res, // proxy express handlers
                context: {},
                timeout: settings.renderTimeout,   // max rendering duration
                limit: settings.renderLimit,       // max re-rendering operations
            })
            : {
                html: '',
                initialState,
                context: {},
                modules: [],
            }

        // handle server side redirection
        if (prerender.context.url) {
            res.redirect(prerender.context.url)
            return
        }

        // get SEO headers for the page
        const helmet = Helmet.renderStatic()

        // include dynamically requested bundles (via react-loadable)
        // it is skipped in case there is no SSR action
        const mappedBundles = await mapModulesToBundles(settings, prerender.modules)

        const data = {
            ...settings,
            html: helmet.htmlAttributes.toString(),
            head: [
                helmet.title.toString(),
                helmet.meta.toString(),
                helmet.link.toString(),
            ].join(''),
            body: prerender.html,
            // need to remove req, res, history as they can cause circular
            // shit in json stringify
            state: await settings.makeAPPInitialState({
                ...prerender.initialState,
                ssr: {
                    rootUrl: settings.rootUrl || null,
                    apiUrl: settings.apiUrl || null,
                }
            }),
            jsBundles: mappedBundles.js,
            cssBundles: mappedBundles.css,
            context: prerender.context,
        }

        // render HTML and handle custom post processing
        const html = settings.postprocessHtml
            ? settings.postprocessHtml(prepHTML(htmlTemplate, data, { req, res, next }), data)
            : prepHTML(htmlTemplate, data, { req, res, next })

        // decorate the request with the produced html so to allow
        // the implementation of custom caching mechanism or post
        // rendering filters
        if (settings.sendHtml === 'no') {
            req[settings.dataVar] = { html, data }
            return next()
        }

        // send out the page
        if (settings.sendHtml === 'yes') {
            res.send(html)
        }

        // store a cache version of the rendered html
        if (settings.useCache === 'yes') {
            try {
                await cache.set(req, res, html)
            } catch (err) {
                console.log(`[ssr] write cache error for "${req.url}" - ${err.message}`)
            }
        }
    } catch (err) {
        next(err)
    }
}
