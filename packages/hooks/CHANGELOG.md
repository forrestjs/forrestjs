# Change Log

## v4.2.0

- DEPRECATED and moved to @forrestjs/core

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
