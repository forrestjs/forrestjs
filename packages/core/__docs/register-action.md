# API - Register Action

    registerAction(hookName, options)

## Examples

    registerAction('◇ boot', {
        action: 'my-extension',
        handler: () => console.log('Hello World!')
    })

## Options

### action

It's the name of the action, it will be visible in the logs so be carefull with this.

### handler

It's the funciton that will be executed. Mind that the hook could be both synchronous and
asynchronous so you must refer to the documentation of the hook you are extending.

The handler receives a single parameter, an object containing the arguments that are
provided by the hook itself.

The handler can return a value that will be accessible to the hook initiator.

### priority

Optional  
Default: 0

It is used to sort the registered actions into a hook.  
Actions are executer from higer to lower priority:

    100
    ..
    50
    ..
    0
    ..
    -30
    ..
    -90

### trace

Optional

Provide detailed informations how to trace this specific action. I normally
use the `__filenal` property:

    trace: __filename

so that in the error trace I can clearly see who triggered an error.

### ...other 

You can add as many other properties you want, they are collected under the
`meta` property in the trace stack and you can access those using `traceHook()`.

## Returned Values

Each hook will return an array containing the results of each registered action.

Each row is an array containing the result in position `0`, a reference to the
registered action in position `1` and a reference to the hook's options in
position `2`:

    [
        [ result, action, options ],
        ...
    ]

Mind that both `action` and `options` are passed as references (performances, you know...), 
**mutating those object might lead to unexpected behaviours!**

### action

    name
    hook
    trace
    priority
    meta

### options

    sync (serie|parallel|false)
    args
    ctx