# API - createSSRRouter

Use this method to enable SSR in an ExpressJS app:

    const app = express()
    app.use(createSSRRouter(
        port: 8080,
        ...
    ))
    app.listen(8080)

## Settings

### enabled

    value:     (string) [yes|no]
    default:   'yes'
    env:       REACT_SSR_ENABLED

Defines whether the ssr is enabled or not.  
In case ssr is disabled the "build" folder is served as static files.

### blacklist

    value:     (string) comma separated string
    default:   ''
    env:       REACT_SSR_BLACKLIST

Each item in the list is converted into an Express route that points to the
static file resolver (it sends out "build/index.html")

NOTE: If you are using this setting in Node (no ENV variable) then you can
use it as an Array:

    ...
    blacklist: [
        '/foo',
        '/user/:id',
        ...
    ]

### shouldRender()

    value:     (function) can be async
    default:   null

Example:  
skip any route that contains "/foo"

    ...
    shouldRender: (req, res) => req.url.indexOf('/foo') === -1
    ...

---

### initialState

Pass down an initial state before to apply server side rendering.

    initialState: {
        fooReducer: { ... }
    }

#### makeSSRInitialState()

Allows to manipulate the initial state **before** to trigger the ssr.

**NOTE:** This kicks in at every request.

    makeSSRInitialState(state, { req, res, next }) => state

#### makeAPPInitialState()

Allows to manipulate the initial state **after** to trigger the ssr, just
before the state is sent to the client.

**NOTE:** This kicks in at every request.

    makeAPPInitialState(state, { req, res, next }) => state

---

### entryPoint

    value:     (string)
    default:   'index.ssr.js'
    env:       REACT_SSR_ENTRY_POINT

File path relative to the "src" folder that exports the server side render
function created with [createSSRRender](./create-ssr-render.md).

### port

    value:     (string)
    default:   '8080'
    env:       REACT_SSR_PORT

Port on which Express is listening. It is used to correctly configure the
[ssr context](./create-ssr-context.md)

### disableJS

    value:     (string) [yes|no]
    default:   'no'
    env:       REACT_SSR_DISABLE_JS

If set to `yes` the resulting HTML is cleaned by any `<script>` tag and the result
will be a **completely server side rendering static website**.

### renderTimeout

    value:     (number)
    default:   5000
    env:       REACT_SSR_RENDER_TIMEOUT

Maximum amount of time that is given to a server side rendering.

### renderLimit

    value:     (number)
    default:   10
    env:       REACT_SSR_RENDER_LIMIT

Maximum amount of rendering passes in the server.  
It makes it safe in case of server side rendering loops (es if you forget to await or
if you await at each re-rendering).

---

### postprocessHtml(html, data)

Allows for fine tuning in the final HTML rendering process (before caching it).

`data` contains a number of useful staff (you better `console.log` it), but the
most important is the application's `data.context` that you can exploit to pass
informations from your ssr's Root element down to this function.

### sendHtml

    value:     (string) [yes|no]
    default:   'yes'
    env:       REACT_SSR_SEND_HTML

Defines wheather or not to `res.send(html)` after a ssr action ends.

#### dataVar

    value:     (string) [yes|no]
    default:   'ssrOutput'
    env:       REACT_SSR_DATA_VAR

In case `sendHtml` is set to `no`, you can control in which variable you are
going to receive the produced HTML and the relative data.

    console.log(req.ssrOutput)

**NOTE:** Use `sendHtml` and `dataVar` to handle custom post processing. In this
case you also need to manually handle the caching of the request.

---

### root

Absolute path to the project root.  
Default to the `process.cwd()`.

### src

Absoltue path to the client source folder.  
Defaults to `root/src`.

### build

Absolute path to the client bundles.  
Defaults to `root/build`.

### buildSrc

Absolute path to the transpiled client source folder.  
Defaults to `root/build-src`.

### buildSsr

Absolute path to the transpiled backend source folder.  
Defaults to `root/build-ssr`.
