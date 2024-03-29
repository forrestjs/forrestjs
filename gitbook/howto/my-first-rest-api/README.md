# My First REST API

In this tutorial you will learn how to expose a simple RESTfull API using [Fastify](https://www.fastify.io/), the emergent NodeJS Web Framework, in a ForrestJS App.

## Install the Dependencies

In this toutorial we will use the following ForrestJS libraries:

```bash
npm add @forrestjs/core
npm add @forrestjs/service-fastify
npm add @forrestjs/service-fastify-healthz
```

We will also connect to a PostgreSQL database using the library [pg](https://node-postgres.com/):

```bash
npm add pg
npm add envalid
```

Also, we use [Nodemon](https://nodemon.io/) as development runner:

```bash
npm add -D nodemon
```

## Step By Step

- [Fastify App Scaffold](./010-fastify-app-scaffold/README.md)
- [Create a Simple Home Page](./020-fastify-home-page/README.md)
- [The Users Feature](./030-the-users-feature/README.md)
- [Add a New User](./040-add-new-user/README.md)
- [Connect to Postgres as a Service](./050-postgres-service/README.md)
- [Integrate Services and Features](./060-integrate-services-and-features/README.md)
- [Schema and Data Seeding](./070-schema-and-data-seeding/README.md)
- [Integrate Services and Services](./080-integrate-services-and-services/README.md)
- [Evolve Your Schema](./090-evolve-your-schema/README.md)

[[TO BE CONTINUED]]
