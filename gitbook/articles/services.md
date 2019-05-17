# Redux Services

In my book I define a service as a **driver for side effects**.  
The rule of the thumb is:

> If it can go wrong, it belongs to a service

Here are the two points upon which I try to reason about my architecture:

1. **It's easy to deal with immutable things:**  
React proposes 
[UI as a function of the state](http://beletsky.net/2016/04/the-functional-approach-to-ui.html), 
and Redux proposes the
[state as an immutable entity](https://redux.js.org/faq/immutabledata).
_An action (es. user input) produces a new state, and React re-renders the UI
so to represent such state_. Nice, right?
2. **Any app builds on side effects:**  
It's extremely likely for you to deal with stuff
that _"you don't know **if and when** they will be done"_ such **User input** and 
**HTTP Requests**. 

## Redux Thunks

Redux' answer to those needs are the 
[asynchronous actions](https://redux.js.org/advanced/asyncactions), which are usually
implemented with the [redux-thunk](https://www.npmjs.com/package/redux-thunk) middleware.

> There are a bunch of alternatives like [redux-saga](https://redux-saga.js.org)
> that builds on [_generators_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators)
> but I believe that [_async/await_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
> make thunks a much much simpler approach.

You can follow the simple tutorial and setup your own thunks enabled store. Now you
can `dispatch()` both _action creators_ and _thunks_:

    export const SET_LOADING = 'setLoading@posts';
    export const SET_ITEMS = 'setItems@posts';
    export const SET_ERROR = 'setError@posts';

    export const setLoading = value => ({
        type: SET_LOADING,
        payload: Bool(value),
    })

    export const setItems = items = ({
        type: SET_ITEMS,
        payload: items,
    })

    export const setError = value => ({
        type: SET_ERROR,
        payload: String(value),
    })

    export const loadItems = (apiEndpoint) => async (dispatch) => {
        dispatch(setLoading(true))
        try {
            const items = await fetch(apiEndpoint)
            dispatch(setItems(items))
        } catch (err) {
            dispatch(setError(err.message))
        } finally {
            dispatch(setLoading(false))
        }
    }

In the code above we implement a couple of _action creators_ and a single _thunk_. 
Together they solve the responsability of fetching some posts (blog articles) and
storing the data in a reducer (this part is not implemented).

## From Actions to Services

The last sentence from the section above states:

> _"together they solve the responsability of fetching some posts (blog articles)   
> **and**   
> storing the data in a reducer"_

I would like you to focus on the keyword "AND". Whenever you meet this keyword while
listing responsabilities you end up fighting against the [single responsibility principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)
which is the first, and likely the most important, of the [SOLID](https://en.wikipedia.org/wiki/SOLID) principles.

Now, I don't consider myself a fanatic of design patterns, but I did experience that by
**consistently choosing to implement** some of them made my life easier. It's the good old
quest between "easy" and "simple".

Long story short:  
**when you choose "simple" you can't loose**.

And that is basically why I suggest you **divide your _synchronous actions creators_ from your
_asynchronous actions_**. Put those stuff in two different folders!

- src/
    - reducers/
    - services/

I use to put 80-90% of my synchronous actions creators along with the related
[reducer](./reducers.md), and I put my _asynchronous actions_ in a folder called "services".

## Why "services"?

Glad you asked.  
_Why not?_

Well, to be honest I didn't come up with this name by myself.  
I found it in some Redux documentation along with other nice ideas.

Anyway the word "_thunk_" or "_asynchronous action_" is pretty much an implication of the
technical implementation, whether "service" is a more **purpose driven** noun.

I like when things have a clear purpose.

## A Lifecycle proposal:

Often I combine services toghether with other parts of my app into what I call **a feature**.

You can read more about it in the [_"Think in Features" page_](../hotwo/features.md), but
basically I use the [react-redux-feature](https://www.npmjs.com/package/react-redux-feature)
_NPM_ package to divide my app into **purpose driven chunks**.

This thing allows me to simply export an `init()` and `start()` functions from any service
file, and the system guarantees that all the _inits_ will be executed, and then all 
the _starts_. They can also be asynchronous and they works as normal thunks.

This simple pattern allows for booting time initializations or data subscriptions.

## Conclusion

_Services_ is where the unpredictable happens, it's the land of `if/then` and `try/catch`.

Most of the _data business logic_ happens here. In a way, _services_ are the backend of the
frontend application.



