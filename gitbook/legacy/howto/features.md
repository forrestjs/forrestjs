## Think in Features

Let's face it: most of the time we write a bunch of _reducers_, 
[_thunks (or services)_](../articles/services.md) and _containers_.
Those pieces co-operate and interlocks with each other for the
greater good of pulling toghether an app.

But then in our backlog we use a different vocabulary. We do _tasks_ that are
grouped in _epics_ and **relate to _features_**.

> **Features** are more or less the "why" some code gets eventually written.

We can easily group business value into "chunks" or interlocked activities,
and we often refer to this as a "feature".

**I like to think to a feature as a well scoped business value**.  
Something that is easy to draft on a whiteboard as a box, with arrows that
connect it with other features.

If you have followed me so far, you may have figured it out already: I do care
about developing stuff in isolation and I'm a strong sustainer of the famous
[single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle).

## Folder Structure

Well, all of those cool words end up in a simple folder structure that I've used
for the last 4 years to group and scope code so that it relates more to the
business value that it's supposed to unleash:

- /src
  - /features
    - /login
    - /customers
    - /projects
    - /planner

Each feature has a similar internal folder structure (but it might variate based
on necessity and common sense):

- /login
  - /containers
  - /components
  - login.reducer.js
  - login.service.js
  - index.js (feature's manifest)

When a feature has many reducers or [services](../articles/services.md) I usually
group them into `/reducers` and `/services` sub folders as well.

## Beneficts of Features

- you and me can parallelize our efforts by working on different features, less
dependencies, less conflicts (Git conflicts are gone).
- well crafted features might be shared across projects (auth feature?).
- features talk with each other through an API that is detailed in their
`index.js` (the manifest file), or with events.

## Add Features to your App

Let's see the simple steps that we need to undertake in order to enjoy all those
good stuff that we just read.

### Step 1

Create a `/src/features` folder and a `/src/features/index.js` that will list all
the active features in your application:

    // export the list of active features:
    export default []

### Step 2

Let's now tell our application state that we want those features to be picked up
and initialized at boot time. Open `src/state.js` and add the features to the
state manager creator:

    ...
    import features from './features'

    ...

    export const createState = createSSRState(reducers, features)

## That's All Folks!

Yes, it's that simple.

Now you can decide to go on and build some basic features just to get a grip:

- [Build a users manager](./features-users.md)
- [Build a splash screen](./features-splash.md)

