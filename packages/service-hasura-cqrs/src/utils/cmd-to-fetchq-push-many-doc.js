/**
 * Tranforms an Hasura CQRS Command data-type into a
 * `Fetchq.pushMany` document format.
 * @param {*} cmd_scope
 * @returns
 */
module.exports = (scopeValue, subjectField, scopeField) => (cmd) =>
  [cmd[subjectField], 0, { ...cmd, [scopeField]: scopeValue }];
