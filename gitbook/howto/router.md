# Add React Router

[React-router](https://reacttraining.com/react-router/) is possibly the most used library
to implement url based navigation in our apps. I've used it in both web an wrapped native
to complete satisfaction and I can do nothing bu recommend it.

This tutorial drives you through the setup of `react-router` in a universal or isomorphic
React app. You will be able to navigate to a certain page, run a full page reload and
keep your full rendering state.

> Thanks to SSR you will also be able to implement a pure server side rendered website
> by simply setting you app so to skip sending down the `<script>` links!

## Where to start?

This tutorial assumes that you went through the [step by step tutorial](./setup.md)
and have a fully working app. You can always download the ready to use boilerplate
[here](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-universal.zip).

> I've actually extended the
> [deploy with docker](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-universal.zip)
> boilerplate. You may want to take a read to [deploy with Docker](./docker.md) first :-)

## Tutorial Codebase

As always, you can [download the boilerplate](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-router.zip).
where you will find all the files discussed in this page.
