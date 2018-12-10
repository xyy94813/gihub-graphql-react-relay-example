const { injectBabelPlugin } = require("react-app-rewired");
const rewireLess = require("react-app-rewire-less");

module.exports = function override(config, env) {
  config.module.rules.push({
    test: /\.mjs$/,
    include: /node_modules\/react-relay-network-modern/,
    type: "javascript/auto"
  });

  config = injectBabelPlugin("relay", config);
  config = injectBabelPlugin(
    [
      "module-resolver",
      {
        alias: {
          "@": "./src"
        }
      }
    ],
    config
  );
  config = injectBabelPlugin(
    [
      "import",
      {
        libraryName: "antd",
        style: true
      }
    ],
    config
  );
  config = rewireLess(config, env);
  //do stuff with the webpack config...
  return config;
};
