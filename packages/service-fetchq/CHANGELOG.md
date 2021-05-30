# Change Log

## v4.0.0

- Remove Babel
- Integrate with `service-fastify`
  - Integrate with the test healthcheck
  - Provide `/test/fetchq/query` get/post utility
  - Provide `/test/fetchq/:queue/:subject` to retrieve a document status
  - Provide `/test/fetchq/await/:queue/:subject` to await a document status with a configurable timeout
- Integrate with `service-fastify-healthz`
- Provides Jest global utility functions

## v3.13.6

hook FETCHQ_REGISTER_WORKER can return an array of definitions
