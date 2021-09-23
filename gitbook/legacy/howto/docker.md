# Deploy with Docker

It's always been a challenge to bring your app to production. Lukily for us
[Docker](https://www.docker.com/) came and made things much much easier, taking
away all the server-level knowledge that was once needed.

In this tutorial we are going to package our universal app as a Docker image
that you can run, distribute on Docker Hub, and deploy on one of the many
serverless services available today.

> **NOTE:** This tutorial assumes that you went through the [step by step tutorial](./setup.md)
> and have a fully working app. You can always download the ready to use boilerplate
> [here](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-universal.zip).

### Dockerfile

A [Dockerfile](https://docs.docker.com/engine/reference/builder/) is the receipt for
a new Docker image. You can write yours in `/Dockerfile`:

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

    CMD node index.js

Long story short this is the best I could come up with to achieve my 2 main goals:

- quick build
- small image size

You also want to edit the production entry point `index.js` and add:

    // Let Docker exit on Ctrl+C
    process.on('SIGINT', function() {
        process.exit();
    });

This will ensure that the container correctly exits when you `Ctrl+C`!

You can test this out by building this image:

    docker build -t cra-ssr .

And then by running it:

    docker run --rm -p 8080:8080 cra-ssr

If all goes as expected you should be able to open your app on:

    http://localhost:8080

> **NOTE:** if `8080` is not available you can change it to pretty much any value:  
> `docker run --rm -p 9876:8080 cra-ssr`



### Makefile

[make](https://www.tutorialspoint.com/makefile/) come built into every linux desktop
distribution that I know. Let's use it!

You might be already familiar with Grunt or Gulp... well... Make exists practically since 
the beginning of time and does more or less the same stuff as Grunt or Gulp. But it does it
in your terminal so it is way more powerful.

In this section you are going to create a `/Makefile` with some simple tasks that will
make it easier to build and run your Docker project:

```sh
#
# Simple interface to run Docker!
#


# Running container's name
name?=cra-ssr

# Docker image tag name
tag?=${name}

# Build the project using cache
image:
	docker build -t ${tag} .
    
# Spins up a container from the latest available image
# this is useful to test locally
run:
	docker run \
        --rm \
        --name ${name} \
        -p 8080:8080 \
        ${name}

stop:
    docker stop ${name}

remove:
    docker rm ${name}

# Like start, but in background
# classic way to launch it on a server
boot:
    docker run \
        -d \
        --name ${name} \
        -p 8080:8080 \
        ${name}

down: stop remove

# Gain access to a running container
ssh:
    docker exec \
        -it \
        ${name} \
        /bin/sh
```

> **NOTE:** you must substitute the indentation with `tabs` for Make to work
> properly.

To use this stuff simply open your terminal and try to type:

    make image
    make boot

This will build your app and run it in background.

    make down

Will stop it and remove the container.

Do you want to run the app and access the Docker container to inspect some stuff?

    make boot
    make ssh

(`Ctrl+c` to exit back to your terminal)

### docker-compose.yaml

The last option is [docker-compose](https://docs.docker.com/compose/) which I believe to be
one of the greatest achievement of Mankind.

Create `/docker-compose.yaml`:

    version: '2.1'
    services:
        app:
            build: .
            ports:
                - 8080:8080

Then just type this in your terminal:

    docker-compose up

You app will magically start.

## Go live on Now.sh

[now.sh](https://zeit.co/now) is a wonderful serverless platform that let you
run some small app for free in a varaiety of possible ways.

We take advantage of our Docker definition and make our app available to the entire
world in 3 simple steps:

### Step n.1 - Create an account

[Go to "now.sh"](https://zeit.co/now) and create your free account, you can quikly
login with your GitHub account.

At one point you will be prompted to download the Now app and CLI utility. We are
going to use it in step n.3!

### Step n.2 - Create a deploy manifest

Create `/now.json`:

    {
      "version": 1,
      "type": "docker",
      "features": {
        "cloud": "v2"
      }
    }

### Step n.3 - Deploy!

    now

Yes, it's that simple.

Take a close look at the console because you will be given your app's url.  
Mine is: [https://cra-ssr-ancovrmtzt.now.sh/](https://cra-ssr-ancovrmtzt.now.sh/).

## Tutorial Codebase

As always, you can [download the boilerplate](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-docker.zip).
where you will find all the files discussed in this page.
