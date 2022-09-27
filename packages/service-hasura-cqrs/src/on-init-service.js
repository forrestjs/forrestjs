const validateSource = require("./utils/validate-source");
const validateRouter = require("./utils/validate-router");
const validateShard = require("./utils/validate-shard");
const validateRestify = require("./utils/validate-restify");
const toSourceMap = require("./utils/reduce-source-map");
const toRestifyMap = require("./utils/reduce-restify-map");
const toMap = require("./utils/list-to-map");

module.exports = (_, { createExtension, getConfig, setContext }) => {
  const sources = createExtension
    .sync("$HASURA_CQRS_SOURCE")
    .map(($) => $[0])
    .map(validateSource);

  const routers = createExtension
    .sync("$HASURA_CQRS_ROUTER")
    .map(($) => $[0])
    .map(validateRouter);

  const shards = createExtension
    .sync("$HASURA_CQRS_SHARD")
    .map(($) => $[0])
    .map(validateShard);

  const restify = createExtension
    .sync("$HASURA_CQRS_RESTIFY")
    .map(($) => $[0])
    .map(validateRestify);

  setContext("hasuraCQRS", {
    sources: {
      list: sources,
      map: sources.reduce(toSourceMap, {})
    },
    routers: {
      list: routers,
      map: toMap(routers, "source")
    },
    shards: {
      list: shards,
      map: toMap(shards, "source")
    },
    restify: {
      list: restify,
      map: restify.reduce(toRestifyMap, {})
    }
  });
};
