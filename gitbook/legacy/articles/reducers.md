# Redux Reducers

Redux's documentation provides a very comprehensive definition of what a reducer is
and how to structure it.
[You can read it here](https://redux.js.org/recipes/structuringreducers).

In this page I'm going to **propose a personal approach to reducers** based on some years
of practice (and endless fuckups and rewriting) developing React/Redux apps.

## Give me the code

Without any further chit-chat here it is a possible implementation of a "todos" reducer:

    /**
     * Manifest
     */

    const initialState = {
        list: [],           // keeps a sorted list of my data
        filter: null,       // allow filtering by "category"
        filteredList: null, // cached list of items with a filter applied
                            // avoid heavy re-rendering operations
    }

    // those actions are unlikely to be implemented by other reducers
    export const SET_ITEMS = 'setItems@todos'
    export const SET_FILTER = 'setFilter@todos'
    export const UNSET_FILTER = 'unsetFilter@todos'

    // this is likely implemented by many other reducers as well
    export const CLEANUP = '@LOGOUT'

    /**
     * Action Creators
     */

    export const setItems = items => ({
        type: SET_ITEMS,
        payload: items,
    })

    export const setFilter = filter => ({
        type: SET_FILTER,
        payload: String(filter),
    })

    export const unsetFilter = () => ({
        type: UNSET_FILTER,
    })

    /**
     * Action Handlers
     */

    // internal helper to compute derived state
    const getFilteredList = (items, filter) => filter
        ? items.filter(item => item.category === filter)
        : null

    export const actionHandlers = {
        [CLEANUP]: () => ({ ...initialState }),
        [SET_ITEMS]: (state, { payload }) => ({
            ...state,
            list: [ ...payload ],
            filteredList: getFilteredList(payload, state.filter),
        }),
        [SET_FILTER]: (state, { payload }) => ({
            ...state,
            filter: payload,
            filteredList: getFilteredList(state.items, payload),
        }),
        [UNSET_FILTER]: state => ({
            ...state,
            filter: null,
            filteredList: null,
        }),
    }

    /**
     * Create the reducer function
     */

    export default (state = initialState, action) => {
        const handler = actionHandlers[action.type]
        return handler ? handler(state, action) : state
    }

I'm quite sure you have mixed feelings about what you just read. It's ok, I had it too.

For the rest of this article I'm going to explain my point of view regarding some decisions
that are implemented in the source code above.

## ES6 - Write less, expressive code

Does the code above look complicated to you? Yes? Great!

In my experience is best for Reducer's code to follow those principles:

- it should be [_DRY_](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself)
- it should be boring
- it should be testable

#### DRY Explained:

[ES6](http://es6-features.org) comes with some great and expressive syntaxes that make
a reducer source very very simple. Simple means "with as less white noise as possible":

- [arrow functions](http://es6-features.org/#ExpressionBodies)
- [default parameter](http://es6-features.org/#DefaultParameterValues)
- [spread operator](http://es6-features.org/#SpreadOperator)
- [property shorthand](http://es6-features.org/#PropertyShorthand)
- [computed property name](http://es6-features.org/#ComputedPropertyNames)

Combine all of this, and you can get rid of the `switch` operator, plus you will unleash
the simplicity of immutability applied to objects.

#### Why should reducer's code be boring?

Come on, let's face the fact that actions/reducers solve an extremely well defined
purpose of taking "ObjectA" and return "NewObjectA" with a different data in it.

Reducers are supposed to **implement pure functional data tranformation** stuff.

**They should not fail** (there are no side effects in reducers) so there is very 
little error handling to do.

> If something fail, is a bug to be fixed, not an exception to be handled!

You are definetly not supposed to take smart decisions in a reducer's source code.
(You are supposed to take smart decision when you architect your state shape, but this
is a different discussion altogether!)

#### Why testing the obvious?

If a reducer is so simple, why test it? 

I'm glad you asked. Testing a reducer is like introducing 
[MFA](https://en.wikipedia.org/wiki/Multi-factor_authentication) for your state.

When one day you wake up with a brilliant idea and start poking around your codebase
randomly changing pieces of valuable logic, you will hear some screaming coming from
your CI.

At that point you will simply need to reflect a little longer on the changes that you
are introducing. You will have 2 options:

* **Option n.1 -** the change you are doing is not worth updating the 
  tests you already have.  
  Then you revert and go on with your life.
* **Option n.2 -** it's worth it.  
  So you go ahead and take care of updating the tests that fail.

> Just promise me you will NOT simply `.skip()` the failing tests!

## The Pareto Principle

[The Pareto principle](https://en.wikipedia.org/wiki/Pareto_principle) (aka: the 80/20)
applied to Redux' reducers could be phrased as:

> 80% of any app reducers solve a well scoped problem

It's extremely likely that you write a `todos` reducers and a `users` reducers and both
of them respond to actions that are non shared like `ADD_TODO` and `SET_USER_IMAGE`.

Later on you might create an `auth` **service** which `logout()` action need to operate
on both `todos` and `users` to clean up data that are of a user that just logged out.

It's only at that point that both reducers will need to implement the `CLEANUP` action.

**In conclusion, each reducer might end up with 5/6 dedicated actions
and just 1 shared action.**

That is enough for me to suggest 2 guidelines:

- keep your actions within your reducers
- it's kinda ok to use strings for the occasional shared actions.

In the source code above you can clearly see a **well structured manifest** of all the
reducer's capabilities. This manifest is exported in the form of 
[**action names**](https://redux.js.org/basics/actions) and
[**action creators**](https://redux.js.org/basics/actions#action-creators).

Because Redux' action names are globals to the store, I use to suffex the "local actions"
with the reducer's name, hence any action name is written with a simple format:

    {actionName}@{reducerName}

When it comes to shared actions, or global actions, I tend to follow Redux' general pattern
of expressing them as a capitalized word with an `@` in the beginning:

    @{ACTION_NAME}

This simple rule will make your life easy when investigating stuff in the Redux devTools.

## Compute local derived state

Ever since we are young child we have been told that _Containers_  are a good place
for merging pieces of state coming from different reducers, and compute derived state.

If you want to be a nice kid, you can use [reselect](https://github.com/reduxjs/reselect)
to unleash the power of memoization and optimize the process.

Right? Well... Waaait a minute...

It turns out that most of the computed state that I've ever come to work with is local
to a single reducer.

In the source code above we want to maintain the list of todo items and some kind of
filter string that has the purpose to hide some items. It's a pattern that repeat a lot.

If you think about it, I'm sure you realize that your `ListView` component will render
many many more times, and that to compute the filtered list each time is kinda waste
of resources. **You are definetly right**.

By using some simple local helper functions we can keep our source code DRY, and at the
same time we can operate some simple **derived state that will compute only when
data change**, not when the app re-render.

Because your state might be responsible of handling a huge amount of data, this can easily
turn out to be a great (and simple) **performance boost for your app**.

