# SSR - Folders Structure

    - cra-ssr/
      - build/       // transpiled
      - build-src/   // transpiled
      - build-ssr/   // transpiled
      - src/         // client app
      - ssr/         // server app
      - index.js
      - index.dev.js

## Source Folders

Those are the places where you need to write stuff.

### /src

We already know `src`. It contains the source code of the client app. Thanks to
the NPM script `npm run build` we can then produce the production ready version
of it which is store into the `build` folder.

### /ssr

`ssr` is the server counterpart. Here we are going to write all our backend logic.
Backend rendering happens here, along with database connections, REST, GraphQL and
Socket providers, and - give or take - whathever else you might wish to do.

### Entry points

`index.js` is the production entrypoint of our universal app. Is going to kick off
the server in production mode.

`index.dev.js` is the development entrypoint. We will wire this up with tools like
`nodemon` so that the server will promptly reload when changes are made to the app.

## Artifacts Folders (transpiled)

You don't write stuff in those folders, there are NPM scripts that update those
folders from your sources.

Those are also the folders that need to be shipped to production (es: a Docker image)

### /build

`build` contains the production ready client application. Javascript files are
both transpiled and bundled together. Here we have also the HTML entry point 
along with CSS and static assets.

### /build-src

`build-src` contains the transpiled version of your client app. Javascript is being
transpiled, any CSS reference is being ignored and references to other types of
static assets (like images) are being embedded as base64, or referenced as urls to
the running backend app.

_Basically files from this folders can be required and executed in NodeJS_.

### /build-ssr

`build-ssr` contains the transpiled version of your server app. NodeJS can run this
files without the need to transform them any further.

## .gitignore

I normally gitignore all the artifacts folders (`build`, `build-src` and `build-ssr`)
because they can be regenerated from the sources. I really don't like to push them
to GitHub.

On the other hand those are the real stuff, files from thos folders are running in
production, not the sources.

That means that if you gitignore them, and then clone the repo in a server, you will
need to run a full development install, and re-build the artifacts before running the
app.

So basically it's up to you! My way is to keep my source files in GitHub and build my
artifacts as Docker images.
