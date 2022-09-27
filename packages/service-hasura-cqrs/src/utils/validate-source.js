class FetchqCQRSSourceError extends Error {
  constructor(message) {
    super(message);
    this.name = "FetchqCQRSSourceError";
  }
}

module.exports = ({
  /**
   * type: String
   *
   * Unique identifier of the data source
   */
  name,

  /**
   * type: String[]
   *
   * List of Fetchq queues that can be uses as targets
   * by the routing function.
   */
  targets,

  /**
   * type: Boolean
   *
   * Test for the existance of all the target queues and
   * fail the boot in case a queue does not exists
   */
  checkOnBoot = true, // check targets exist at boot time

  /**
   * type: Function(sourcedItem: Object, availableTargets String[]): routedTargets: String[]
   *
   * It allows to perform routing logic at ingestion time,
   * effectively skipping routers and sharding steps.
   *
   * It may boost performances, but it also increase the
   * probability for errors.
   *
   * If provided, it should be thoroughly tested!
   */
  router = (sourcedItem, availableTargets) => [targets[0]],

  /**
   * type: GraphQL
   *
   * Data ingestion query.
   * It should return the list of items to ingest.
   *
   * The worker expects a returning shape as in:
   *
   * {
   *   items: [{ f1, f2 }]
   * }
   */
  graphqlQuery,

  /**
   * type: (task: Object, sourceName: String): GraphQLVariables
   *
   * It computes the variables to issue with the GraphQL query
   * in order to fetch the next batch of data.
   *
   * TaskPayload so far contains a "cursor" field that contains either:
   * - initialCursor
   * - buildNextCursor() result
   */
  buildQueryVariables = (taskPayload, sourceName) => {},

  /**
   * type: String
   *
   * Provide the initial value of the fetch query cursor.
   * By default, we assume a cursor based on "created_at".
   */
  initialCursor = "1970-01-01",

  /**
   * type: (sourceItem: Object, sourceName: String): String
   *
   * Provide the cursor for fetching the next batch of data.
   * The last returned item is given as input.
   */
  buildNextCursor = (sourceItem, sourceName) => sourceItem.created_at,

  /**
   * type: (sourceItem: Object, sourceName: String): String
   *
   * It should extract a unique identifier for the incoming item.
   * It is used as Fetchq subject in the managed pipelines.
   */
  buildSubject = (sourceItem, sourceName) => sourceItem.cmd_id,

  /**
   * type: (sourceItem: Object, sourceName: String): FetchqPayload
   *
   * It transforms the incoming item into the internal document.
   * Normally this is used to decorate the item with some stuff.
   */
  buildDocument = (sourceItem, sourceName) => sourceItem,

  /**
   * Manage task rescheduling policies
   */
  sleepOnSuccess = "-1ms",
  sleepOnEmpty = "+1s",
  sleepOnError = "+1s",

  /**
   * Manage the log level for this ForrestJS target
   */
  shouldLog = true
} = {}) => {
  if (!name || name === "") {
    throw new FetchqCQRSSourceError("Missing property: name");
  }
  if (!targets) {
    throw new FetchqCQRSSourceError("Missing property: target");
  }
  if (!Array.isArray(targets)) {
    throw new FetchqCQRSSourceError(
      "Malformed property: targets, should be an array"
    );
  }
  if (!targets.length) {
    throw new FetchqCQRSSourceError("Source need at least one target");
  }
  if (!graphqlQuery || graphqlQuery === "") {
    throw new FetchqCQRSSourceError("Missing property: graphqlQuery");
  }
  if (!buildQueryVariables) {
    throw new FetchqCQRSSourceError("Missing property: buildQueryVariables");
  }
  if (typeof buildQueryVariables !== "function") {
    throw new FetchqCQRSSourceError("Malformed property: buildQueryVariables");
  }

  return {
    name,
    targets,
    router,
    graphqlQuery,
    buildQueryVariables,
    sleepOnSuccess,
    sleepOnEmpty,
    sleepOnError,
    initialCursor: String(initialCursor),
    checkOnBoot: Boolean(checkOnBoot),
    buildSubject,
    buildNextCursor,
    buildDocument,
    shouldLog
  };
};
