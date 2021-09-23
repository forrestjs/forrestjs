# Add GraphQL

In the [add React Router](./router.md) tutorial we introduced a few more _HTTP Requests_
toward [jsonplaceholder](https://jsonplaceholder.typicode.com) in order to fetch a rich
set of user's details.

> Each time you open a user's page the app makes 3 calls.   
> **Highly inefficient**. Isn't it?

In this tutorial we will move the external data fetching responsability to our backend,
so that the client will only have to deal with simple "app-to-app" API calls.

## Where to start?

This tutorial assumes that you went through the [react-router tutorial](./router.md)
and have a fully working app. You can always download the ready to use boilerplate
[here](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-router.zip).

> I've actually extended the
> [customize ESLint](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-eslint.zip)
> boilerplate. I suggest you start from that one.

## Tutorial Codebase

As always, you can [download the boilerplate](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-graphql.zip).
where you will find all the files discussed in this page.
