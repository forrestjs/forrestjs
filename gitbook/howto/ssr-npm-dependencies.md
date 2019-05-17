## SSR - NPM Dependencies

Here is the list of the NPM packages that we are going to install:

### Dev Dependencies

The following list of packages are needed to transpile our client app and make it
run on NodeJS.

Note that they are saved as _development_ dependencies and will not
be needed to run the production build.

    npm install --save-dev \
        nodemon \
        @babel/cli \
        @babel/register \
        @babel/preset-env \
        @babel/preset-react \
        babel-plugin-dynamic-import-node-babel-7 \
        babel-plugin-transform-require-ignore

### Dependencies

The following two packages enables Node to use the standard
[fetch api](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API) that are
very well supported by modern browsers, hence to limit the need for external libraries
(I used to use _superagent_) that would increas the final bundle size.

    npm install --save \
        @babel/polyfill \
        express \
        es6-promise \
        isomorphic-fetch \
        react-helmet \
        history

