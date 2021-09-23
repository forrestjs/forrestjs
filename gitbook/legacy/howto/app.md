# Universal App

The goal with `react-ssr` is to reduce the amount of time that we spend thinking
in therms of `client` and `server`, and simply think about our `app`.

- What is it going to do?
- Which features do we want to create?
- How data flows around it?

The general idea is that our app is the client facing layer of what may become
a fairly complex system. In this layer we want to take care of a limited set of
responsabilities:

- UI/UX
- PWA capabilities
- Client data management
- Data fetching

We would like to write as much React code as possible, and as little backend-like
code as possible.

We basically want to be free to choose whatever backend technology that better suit
our specific need. (spoiler alert: Node fits very very well with GraphQL!)

## Tutorial Codebase

By undertaking this tutorial (~5 minutes of your time) you will build a simple web
page powered by [create-react-app](https://facebook.github.io/create-react-app/).

You will find every single line of code in the following pages, nothing is left out,
but if you are very courious and decide that you simply want to run it then
[download the boilerplate](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-frontend.zip).

