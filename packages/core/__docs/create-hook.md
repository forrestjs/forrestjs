# API - Create Hook

    createHook(hookName, options = {})

## Synchronous Hooks

    const res = createHook('hook-name', {
        args: {
            arg1: 'foo',
            arg2: 123
        },
    })

    // res:
    // [ res1, res2, ... ]



## Asynchronous Hooks

    const res = await createHook('hook-name', {
        async: 'serie' // or 'parallel'
        args: {
            arg1: 'foo',
            arg2: 123
        },
    })

    // res:
    // [ res1, res2, ... ]

## Options

### args

It's an object that is passed down to each registered action.

### async

It's **optional**, if present should be either `serie` or `parallel`.

### ctx

Defines the tracing context for a hook, it defaults to `boot` and most of the
time you don't need to worry about it.

@TODO: explain how to use this to correctly trace hooks that are placed into
ExpressJS routes handlers.

### onError

@TODO: how to handle a hook error

### onItemError

@TODO: how to handle a hook error on a particular item

