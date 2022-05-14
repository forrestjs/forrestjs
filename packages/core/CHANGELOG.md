# Change Log

## 4.4.3

- Changed lifecycle order, single endpoints go first
- The appTrace integration goes last in `$FINISH`
- Deprecate `registerAction([name, handler, option])`
- Deprecate `registerAction(name, handler, option)`
- Moved the App tracing log out of the `$FINISH` extension
- Deprecate the `forrest.run([ feature, feature ])`
- Improve `getConfig()` error trace
- Improve `getContext()` error trace
- Improve `registerAction()` error trace

## 4.4.2

- Expose all registered targets

## v4.3.0

- `createExtension` accepts referenced Target names as in `$TARGET_NAME`
- deprecate `getAction` for `getTarget`

## v4.2.0

- Deprecate `createHook` for `runActions`
- Deprecate `registerAction({ hook: 'xxx' })` for `registerAction({ target: 'xxx', name: 'yyy' })`
- Deprecate `registerAction` for `registerExtension`
- Deprecate `registerHook` for `registerTargets` who always get a map of hooks to add
- Deprecate `getHook()` for `getAction()`

## v4.1.0

- Deprecate array based declarative features [ hook, handler, ... ]
- Deprecate `runHookApp`
- Deprecate `createHookApp`
- Handle a list of declarative hooks as a Feature manifest
- Expose `forrestjs.run()` API

## v4.0.0

- Removed babel
- Features and services names defaults are derived by their registration form and automatically prefixed
- Added support for positional definition in `registerRoute`
- Allows for order-independent service2service and feature2feature integration
- Deprecate "createHook" in favor of "runHook"
