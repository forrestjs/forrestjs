const sourceToTask = require("./utils/source-to-task");
const handler = require("./lib/source.handler");

// Properties to be applied to every task:
const taskProps = {
  // resetOnBoot: true,
  handler
};

// Maps the registered data-sources into Hasura Tasks:
module.exports = (_, { getContext }) =>
  getContext("hasuraCQRS.sources.list").map(sourceToTask(taskProps));
