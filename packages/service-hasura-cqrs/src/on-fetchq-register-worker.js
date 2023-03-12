const routerToWorker = require("./utils/router-to-worker");
const restifyToWorker = require("./utils/restify-to-worker");
const routerHandler = require("./lib/router.handler");
const shardHandler = require("./lib/shard.handler");
const restifyHandler = require("./lib/restify.handler");

module.exports = (_, { getContext }) => {
  const routers = getContext("hasuraCQRS.routers.list").map(
    routerToWorker({ handler: routerHandler })
  );

  const shards = getContext("hasuraCQRS.shards.list").map(
    routerToWorker({ handler: shardHandler })
  );

  const restify = restifyToWorker({
    handler: restifyHandler
  })(getContext("hasuraCQRS.restify.map"));

  return [...routers, ...shards, ...restify];
};
