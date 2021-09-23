# Search Engine Marketing Optimization

This is a subject that I've heard spoken with awe and fear many many times.
I could never understand the reasons for the fear.

[React-helmet](https://www.npmjs.com/package/react-helmet) is a crazy simple to
implement library that will update your title, as long with a couple of other
meta tags, within the React rendering cycle.

You can freely use it around your app as everything is already wired up for SSR
by `@marcopeg/react-ssr` (yes, this module that you are reading the docs about).

## Where to start?

This tutorial assumes that you went through the [react-router tutorial](./router.md)
and have a fully working app. You can always download the ready to use boilerplate
[here](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-router.zip).

### Just use it:

Integrate Helmet in `/src/App.js`:

    import { Helmet } from 'react-helmet'

    ...

    <div className="App">
        <Helmet>
            <html lang="en" />
            <title>@marcopeg/react-ssr</title>
        </Helmet>

    ...


And in `/src/feature/users/UserPage.container.js`:

    import { Helmet } from 'react-helmet'

    ...

    return (
        <div style={styles.wrapper}>
            <Helmet>
                <title>{user.name}</title>
            </Helmet>

    ...

## Mind double titles!

If you are running this tutorial as a `create-react-app` like I do, you need to
edit the `public/index.html` and remove the static title that they provide:

     <title>Create React App</title>

If you forget to do this, there are great chanches that you keep seeing the
static title. This is a bit of a hassle to remember... but it's easy to fix ;-)

## Tutorial Codebase

As always, you can [download the boilerplate](https://github.com/marcopeg/react-ssr/raw/master/examples/cra-ssr-seo.zip).
where you will find all the files discussed in this page.
