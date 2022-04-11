const str2bool = require("./str2bool");

/**
 * Array reducer that transform a list of maps into a map of lists:
 *
 * Input:
 * [
 *   { a: 1, b: 2 },
 *   { a: 3 }
 * ]
 *
 * Output:
 * {
 *   a: [ 1, 3 ],
 *   b: [ 2 ]
 * }
 * @param {*} acc
 * @param {*} curr
 * @returns
 */
const list2map = (acc, curr) => {
  Object.keys(curr).forEach((key) => {
    if (acc[key]) {
      acc[key] = [...acc[key], curr[key]];
    } else {
      acc[key] = [curr[key]];
    }
  });

  return acc;
};

module.exports = ({ getConfig, setContext, createExtension }) => {
  const prefix = getConfig("hasuraAuth.prefix", "/hasura-auth");
  const enableGet = str2bool(getConfig("hasuraAuth.get.isEnabled", true));
  const enablePost = str2bool(getConfig("hasuraAuth.post.isEnabled", true));

  const getHooks = createExtension
    .sync("$HASURA_AUTH_GET")
    .map(($) => $[0])
    .reduce(list2map, {});

  const postHooks = createExtension
    .sync("$HASURA_AUTH_POST")
    .map(($) => $[0])
    .reduce(list2map, {});

  setContext("hasuraAuth", {
    prefix,
    enableGet,
    enablePost,
    getHooks,
    postHooks
  });
};
