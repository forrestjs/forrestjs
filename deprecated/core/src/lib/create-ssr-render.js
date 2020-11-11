import React from 'react'
import Loadable from 'react-loadable'
import { renderToString } from 'react-dom/server'
import ssrVersion from './current-version'
const createHistory = require('history').createMemoryHistory

/*
- initialState:
  - ssr
    - serverUrl: http://localhost:8080
    - apiUrl: http://localhost:8080/api
    - request: express request object

- settings
  - timeout: 5000
  - userAgent: 'string'
*/

// @TODO: handle react-loadable
export const renderApp = ({ Root, location, context, initialState }) => ({
    html: renderToString(React.createElement(Root, {
        ...initialState,
        location,
    })),
    initialState,
    context,
    modules: [],
})

export const renderAppWithState = ({ Root, store, location, context, timeout, limit }) =>
    new Promise((resolve, reject) => {
        const { ssr } = store.getState()
        const modules = []
        let rerenderCount = 0

        const timer = setTimeout(() => reject(new Error('timeout')), timeout)

        const registerModule = (moduleName) => {
            // console.log(moduleName)
            if (modules.indexOf(moduleName) === -1) {
                modules.push(moduleName)
            }
        }

        const tick = async () => {
            // apply a safe limit of deep rerendering
            if (rerenderCount >= limit) {
                clearTimeout(timer)
                return reject(new Error('limit'))
            } else {
                rerenderCount += 1
            }
            
            // run the static render
            const previousLength = modules.length
            const html = renderToString(
                <Loadable.Capture report={registerModule}>
                    <Root
                        store={store}
                        location={location}
                        context={context}
                    />
                </Loadable.Capture>
            )

            // import redirect api context into the static execution context
            // of the router
            const ssrRedirect = ssr.getRedirect()
            if (ssrRedirect) {
                context.url = ssrRedirect.url
                context.code = ssrRedirect.code
            }

            // in case of redirection, breaks the rendering loop
            if (context.url) {
                clearTimeout(timer)
                resolve({ html, modules, context })
                return
            }

            // await for asynchronous modules loading to complete
            if (modules.length > previousLength) {
                ssr.await(Loadable.preloadAll())
            }

            // check the completeness of the rendering loop
            if (!ssr.checkStack()) {
                clearTimeout(timer)
                resolve({ html, modules, context })
            } else {
                ssr.once('complete', tick)
            }
        }
        
        tick()
    })

export const createSSRRender = (Root, { createState } = {}) => {
    const ssrRender = async (location, initialState, settings) => {

        // ssr for a basic cra app without redux
        if (!createState) {
            return await renderApp({
                Root,
                location,
                initialState,
                context: settings.context,
            })
        }

        // setup the application state, history is not used but is
        // needed for the correct working of the create state thingy
        const history = createHistory()
        const state = await createState(initialState, history)

        // render the app awaiting for async calls and react-loadable things
        let rendered = null
        try {
            rendered = await renderAppWithState({
                Root,
                location,
                store: state.store,
                context: settings.context,
                timeout: settings.timeout,
                limit: settings.limit,
            })
        } catch (err) {
            console.log('error', err.message)
            rendered = {
                html: '',
                context: {},
                modules: [],
            }
        }

        // console.log('FINAL RENDER', rendered)
        // console.log(state.store.getState())

        return {
            ...rendered,
            initialState: state.store ? state.store.getState() : initialState,
        }
    }

    // the version is used to check if server and client are aligned with the same library
    ssrRender.ssrVersion = ssrVersion
    return ssrRender
}

export default createSSRRender
