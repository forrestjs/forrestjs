const ApolloClient = require("apollo-boost").default;
require("cross-fetch/polyfill");

const { SERVICE_NAME, ...hooks } = require("./hooks");

module.exports = ({ registerAction, setContext, getConfig, registerHook }) => {
  registerHook(hooks);

  registerAction({
    hook: "$INIT_SERVICE",
    name: SERVICE_NAME,
    handler: () => {
      const apollo = new ApolloClient(getConfig("apollo.client.config", {}));
      setContext("apollo", apollo);
    }
  });
};
