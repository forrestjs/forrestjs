import path from 'path'
import fs from 'fs'
import express from 'express'
import { createSSRRegisterHook } from './create-ssr-register-hook'
import { serveAppStatic } from './serve-app-static.middleware'
import { serveAppSSR } from './serve-app-ssr.middleware'
import { serveBuild } from './serve-build.middleware'
import { init as initMemcached } from './memcached'

export const createSSRRouter = (receivedSettings = {}) => {
    const router = express.Router()

    const defaultSettings = {
        // do you want to run ssr or not?
        enabled: String(process.env.REACT_SSR_ENABLED || 'yes'),

        // function
        // async (req, res) => boolean
        // dynamically decide whether or not to server side render a request
        // should return a boolan, can be asynchronous.
        shouldRender: null,

        // allow to dynamically modify the initialState of the app
        // both the functions can be asynchronous
        initialState: {},
        makeSSRInitialState: $ => $,
        makeAPPInitialState: $ => $,

        // comma serparated list of routes that will skip ssr
        blacklist: String(process.env.REACT_SSR_BLACKLIST || ''),

        // react app's folders (absolute path)
        // we need to know where to locate your client's source files
        // and your ready-to-ship assets.
        root: String(process.env.REACT_SSR_ROOT || process.cwd()),
        src: String(process.env.REACT_SSR_SRC || 'src'),
        build: String(process.env.REACT_SSR_BUILD || 'build'),
        buildSrc: String(process.env.REACT_SSR_BUILD_SRC || 'build-src'),
        buildSsr: String(process.env.REACT_SSR_BUILD_SSR || 'build-ssr'),

        // client entry point for the server side rendering
        // (default: "/src/ssr.js")
        entryPoint: String(process.env.REACT_SSR_ENTRY_POINT || 'index.ssr.js'),

        // @TODO: find out a better way to handle callback urls client-to-server
        // durig ssr.
        port: String(process.env.PORT || process.env.REACT_SSR_PORT || '8080'),

        // strips away all the javascript tags.
        // basically renders a pure HTML static web page.
        disableJs: String(process.env.REACT_SSR_DISABLE_JS || 'no'),
        
        // maximum ssr execution time, useful to reduce server bottlenecks in case
        // apis or similar stuff get into the way
        renderTimeout: Number(process.env.REACT_SSR_RENDER_TIMEOUT || 5000),

        // maximum number of ssr re-rendering waiting for asychronous code to finish
        // this is useful if the client enters in loops based on data loading that
        // does not preserve the results in between renderings
        // @TODO: document this with examples
        renderLimit: Number(process.env.REACT_SSR_RENDER_LIMIT || 10),

        // CRA settings to handle images that might have beed embedded into the
        // shipped bundles, this is used by the "register-hook"
        embedExt: String(process.env.REACT_SSR_EMBED_EXT || '.png,.jpg,jpeg,.gif,svg'),
        embedLimit: Number(process.env.REACT_SSR_EMBED_LIMIT || 10000),

        // allow the in-memory cache system to kick in.
        useCache: String(process.env.REACT_SSR_USE_CACHE || 'yes'),

        // by default the SSR middleware will send out the produced HTML to the client
        // but this could be avoided if the app will implement some custom
        // post-processing logic. 
        sendHtml: String(process.env.REACT_SSR_SEND_HTML || 'yes'),

        // the HTML that is produced after a rendering is appended to the "req"
        // context variable for custom post processing.
        dataVar: String(process.env.REACT_SSR_DATA_VAR || 'ssrOutput'),
    }

    const settings = {
        ...defaultSettings,
        ...receivedSettings,
    }

    // check artifacts folders
    const artifactsCheck = [
        path.join(settings.root, settings.build),
        path.join(settings.root, settings.buildSrc),
        path.join(settings.root, settings.buildSsr),
    ].every(path => fs.existsSync(path))

    if (!artifactsCheck) {
        console.log('')
        console.log('')
        console.log('=== react-ssr ===')
        console.log('In order to run SSR you need to build the project artifacts:')
        console.log('')
        console.log('   npm run build:all')
        console.log('')
        console.log('=================')
        console.log('')
        console.log('')

        if (process.env.NODE_ENV === 'production') {
            throw new Error('[react-ssr] you need to build your project artifacts (npm run build:all)')
        }
    }

    // check client side ssr entry point
    // need to check the entry point in "src" for development or "build-src" in production
    const srcPath = process.env.NODE_ENV === 'development' ? settings.src : settings.buildSrc
    const ssrEntryPointPath = path.join(settings.root, srcPath, settings.entryPoint)
    
    if (!fs.existsSync(ssrEntryPointPath)) {
        console.log('')
        console.log('')
        console.log('=== react-ssr ===')
        console.log('missing:')
        console.log(ssrEntryPointPath)
        console.log('')
        console.log('=================')
        console.log('')
        console.log('')
        if (process.env.NODE_ENV === 'production') {
            throw new Error('[react-ssr] ssr entry point not found!')
        }
    }

    // handle require images & init cache
    if (settings.enabled === 'yes') {
        initMemcached(settings)
        createSSRRegisterHook(settings)
    }

    // serve client app
    let serveApp = settings.enabled === 'yes'
        ? serveAppSSR
        : serveAppStatic

    // Optional blacklist out from ssr
    if (settings.enabled === 'yes' && settings.blacklist) {
        const rules = (Array.isArray(settings.blacklist)
            ? settings.blacklist
            : settings.blacklist.split(',')
        )
        rules.forEach(rule => router.get(rule, serveAppStatic(settings)))
    }

    // Default routes handling
    router.get('/', serveApp(settings))
    router.use(serveBuild(settings))
    router.get('*', serveApp(settings))

    return router
}

export default createSSRRouter
