# Hasura CQRS

Facilitates the management of CQRS pattern using Hasura as database abstraction, Fetchq as orchestrator, and a REST backend as logical executor for the commands.

The Service offers new Extensions to perform different CQRS logic.

Dependencies:

- [service-fetchq](../service-fetchq/)
- [service-fetchq-task](../service-fetchq-task/)
- [service-hasura-client](../service-hasura-client/)

## $HASURA_CQRS_SOURCE

Ingest commands from a CQRS Hypertable into a Fetchq queue.

[Schema](./src/utils/validate-source.js)

## $HASURA_CQRS_ROUTER

Moves documents from one queue to one (or more) target queues, effectively routing documents towards independent streams.

[Schema](./src/utils/validate-router.js)

## $HASURA_CQRS_SHARD

Moves documents from one queue to another target queue, effectively helping to shard a queue into many independent streams.

[Schema](./src/utils/validate-shard.js)

## $HASURA_CQRS_RESTIFY

It consumes one or more queues and makes REST requests in order to process the document.

It also facilitates the writing of the Command response or error into the CQRS Hypertable.

[Schema](./src/utils/validate-restify.js)

