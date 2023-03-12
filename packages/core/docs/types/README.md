# ForrestJS Types Reference

- [`type: ApplicationManifest`](#forrestrun)
- [type: ServiceManifest]()
- [type: FeatureManifest]()
- [type: ExtensionManifest]()
- [`type: ApplicationContext`]()
  - [`ctx.registerAction`]()
  - [`ctx.createExtension`]()
  - [`ctx.registerTargets`]()
  - [`ctx.getConfig`]()
  - [`ctx.getConfig`]()
  - [`ctx.getContext`]()
  - [`ctx.getContext`]()

## type: ApplicationManifest

type: Object

> It describes the composition of the App.

| key      | type                | default           | description                        |
|----------|---------------------|-------------------|------------------------------------|
| settings | `object | function` | `{}`              |                                    |
| services | `Array`             | `[type: Service]` |                                    |
| features | `Array`             | `[type: Feature]` |                                    |
| trace    | `string`            | `null`            | use `compact` to enable boot trace |

## type: ServiceManifest

type: `Array[ExtensionManifest]` or `fn(ctx) => [ExtensionManifest]?

> It describes how a Service interacts with the App

## type: FeatureManifest

type: `Array[ExtensionManifest]` or `fn(ctx) => [ExtensionManifest]?

> It describes how a Feature interacts with the App

## type: ExtensionManifest

| key      | type       | default | description                                                    |
|----------|------------|---------|----------------------------------------------------------------|
| target   | `String`   |         | Name of the extension, or reference to the internal dictionary |
| handler  | `function` |         | Implementation of the extension                                |
| priority | `Number`   | `0`     |                                                                |
| trace    | `String`   |         | Used in the exceptions that are thrown by the extension        |

## type: ApplicationContext

type: Object

> This is given as **second argument** to any Extension handler.

| key             | type       | default | description |
|-----------------|------------|---------|-------------|
| getConfig       | `function` |         |             |
| setConfig       | `function` |         |             |
| setContext      | `function` |         |             |
| getContext      | `function` |         |             |
| registerTargets | `function` |         |             |
| createExtension | `function` |         |             |