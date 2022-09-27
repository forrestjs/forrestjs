/**
 *
 * @param {*} options FetchqTask options
 * @returns
 */

module.exports =
  (options = {}) =>
  ({ name, initialCursor }) => ({
    ...options,
    subject: `fetchq-cqrs-${name}`,
    payload: {
      source: name,
      cursor: initialCursor
    }
  });
