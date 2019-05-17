#
# Build Production Artifacts
# ==========================================
#
# this first step takes in the source files and build the artifacts
# (basicall all that need to be transpiled).
#
# We do install the NPM dependencies twice so to copy over to the
# production image only what is strictly needed to execute our app.
# 
# NPM Install is the first step so to exploit Docker's cache mechanism
# and speed up the building process. We will re-install from NPM only
# if we touch the `package.json` file. Which doesn't happen so often.
#

FROM node:10.14-alpine AS builder

# NPM Install for building
WORKDIR /usr/src/app-build
ADD package.json /usr/src/app-build/package.json
RUN npm install

# NPM Install for production
WORKDIR /usr/src/app-run
ADD package.json /usr/src/app-run/package.json
RUN npm install --only=production

# Copy source files:
WORKDIR /usr/src/app-build
ADD index.js /usr/src/app-build
ADD .babelrc /usr/src/app-build
ADD webpack.config.extend.js /usr/src/app-build
ADD webpackDevServer.config.extend.js /usr/src/app-build

# Build backend
WORKDIR /usr/src/app-build
ADD ssr /usr/src/app-build/ssr
RUN npm run build:ssr

# Build frontend
WORKDIR /usr/src/app-build
ADD src /usr/src/app-build/src
RUN npm run build:src
ADD public /usr/src/app-build/public
RUN ./node_modules/.bin/react-scripts build




#
# Runner Image
# ==========================================
#
# in this step we start over with a fresh image and copy only what is
# strictly necessary in order to run a production build.
#
# the idea is to keep this image as small as possible.
#

FROM node:10.14-alpine AS runner

# Copy assets for build:
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app-run/node_modules ./node_modules
COPY --from=builder /usr/src/app-build/build ./build
COPY --from=builder /usr/src/app-build/build-src ./build-src
COPY --from=builder /usr/src/app-build/build-ssr ./build-ssr
ADD package.json /usr/src/app
ADD index.js /usr/src/app

# Default environment configuration:
EXPOSE 8080
ENV NODE_ENV=production
ENV REACT_SSR=true

CMD node index.js
