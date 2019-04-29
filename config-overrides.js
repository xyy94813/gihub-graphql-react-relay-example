const {
  override,
  addBabelPlugins,
  fixBabelImports,
  addLessLoader
} = require("customize-cra");

const babelPlugins = addBabelPlugins("relay", [
  "module-resolver",
  {
    alias: {
      "@": "./src"
    }
  }
]);

module.exports = {
  webpack: (config, env) =>
    override(
      ...babelPlugins,
      fixBabelImports("antd", {
        style: true
      }),
      fixBabelImports("lodash", {
        libraryDirectory: "",
        camel2DashComponentName: false
      }),
      addLessLoader({
        javascriptEnabled: true
      })
    )(config, env)
  // jest: (config) => config,
};
