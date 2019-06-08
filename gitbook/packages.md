# ForrestJS Packages

Over many many years I found myself configuring some basic stuff over and over again.
Nowadays I do my best to abstract generic needs into sharable and reusable packages
that you find listed here.

Most of them consist in very little amount of code, but they provide _hooks_ so that
your application can **easily extend and customize their behaviour**.

## Services

#### service-env

Reads environment configuration from different _dot-files_ into your `process.env`.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-env)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-env/README.md)

#### service-logger

Offers a simple interface to logging.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-logger)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-logger/README.md)

#### service-jwt

Helps to issue and validate _JWT_ tokens. It is mainly a _Promise_ wrapper around the
package `jsonwebtoken`.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-jwt)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-jwt/README.md)

#### service-hash

It provides some basic cryptographic helper methods to safely hash passwords.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-hash)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-hash/README.md)

#### service-express

It helps setting up and running an _ExpressJS_ App. You will be able to provide custom
routes and middlewares by hooking into it.

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-express)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-express/README.md)

#### service-express-graphql

It provides a _GraphQL_ endpoint in your _ExpressJS_ app, and simple ways to inject
custom queries and mutations.

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-express-graphql)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-express-graphql/README.md)

#### service-express-cookies

It helps handling cookies in the server.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-express-cookies)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-express-cookies/README.md)

#### service-postgres

It helps establishing a reliable connection with one or more _Postgres_ databases using the
library `sequelize`. It also provide hooks for features to provide their own data models in
isolation.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/service-postgres)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/service-postgres/README.md)

## Features

#### feature-storage

Provides universal redux dispatch-able actions to handle `localStorage` and `cookies`.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/feature-storage)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/feature-storage/README.md)

#### feature-network

It provides universal redux dispatch-able action to issue _REST_ requests and _GraphQL_ queries.

It also provides reducers and containers to monitor the network status and detect 
online/offline changes.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/feature-network)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/feature-network/README.md)

#### feature-locale

This is a full-stack feature that helps dealing with multilanguage and translatable apps.
It integrates with your _GraphQL_ endpoint and storage/network features.

[[ to be completed ]]

👉 [Install from NPM](https://www.npmjs.com/package/@forrestjs/feature-locale)<br>
👉 [Documentation](https://github.com/forrestjs/forrestjs/blob/master/packages/feature-locale/README.md)
