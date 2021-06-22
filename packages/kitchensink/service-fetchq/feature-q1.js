/**
 * This feature demonstrates some possible scenarios of using Fetchq
 * as part of a ForrestJS application.
 *
 * The goal is also to provide some ideas how to test a queue based app.
 * So take a look at the tests as well.
 * @param {*} param0
 */

const pushDocHandler = (request) =>
  request.fetchq.doc.push(request.params.queue, {
    subject: request.params.subject,
  });

const appendDocHandler = (request) =>
  request.fetchq.doc.append(request.params.queue, request.params);

const readDocHandler = async (request) => {
  const { queue, subject } = request.params;
  const res = await request.fetchq.pool.query(
    `SELECT * FROM "fetchq_data"."${queue}__docs" WHERE "subject" = '${subject}'`,
  );

  return res.rows[0];
};

const workerQ1 = (doc) => doc.drop();

const workerQ2 = async (doc, ctx) => {
  ctx.log.info('Running WorkerQ1');
  await new Promise((resolve) => setTimeout(resolve, 250));
  return doc.complete();
};

const workerQ3 = async (doc, { log, jwt }) => {
  log.info(`Apply JWT sign to "${doc.subject}"`);

  const signed = await jwt.sign({ subject: doc.subject });
  const verified = await jwt.verify(signed);
  const decoded = await jwt.decode(signed);

  return doc.complete({
    payload: {
      ...doc.payload,
      signed,
      verified,
      decoded,
    },
  });
};

const featureQ1 = ({ registerAction }) => {
  // Here we upsert a few queues:
  // https://github.com/fetchq/node-client#queues-configuration
  registerAction({
    hook: '$FETCHQ_REGISTER_QUEUE',
    handler: [
      {
        name: 'q1',
      },
      {
        name: 'q2',
      },
      {
        name: 'q3',
      },
    ],
  });

  // Here we associate our workers:
  // https://github.com/fetchq/node-client#workers-configuration
  registerAction({
    hook: '$FETCHQ_REGISTER_WORKER',
    handler: [
      {
        queue: 'q1',
        handler: workerQ1,
      },
      {
        queue: 'q2',
        handler: workerQ2,
      },
      {
        queue: 'q3',
        handler: workerQ3,
      },
    ],
  });

  // Here we just await for the Fetchq client to be ready, so that
  // we can use its API so push a document into a queue.
  registerAction({
    hook: '$FETCHQ_READY',
    handler: async ({ fetchq }) => fetchq.doc.append('q1', { name: 'foo' }),
  });

  // Here we integrate Fastify and Fetchq so that a REST request can
  // end up pushing documents into a queue for further processing.
  registerAction({
    hook: '$FASTIFY_GET',
    handler: [
      {
        url: '/fetchq/append/:queue/:name',
        handler: appendDocHandler,
      },
      {
        url: '/fetchq/push/:queue/:subject',
        handler: pushDocHandler,
      },
      {
        url: '/fetchq/status/:queue/:subject',
        handler: readDocHandler,
      },
    ],
  });
};

module.exports = featureQ1;
