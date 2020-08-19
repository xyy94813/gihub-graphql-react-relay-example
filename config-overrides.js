const {
  override,
  addBabelPlugins,
  fixBabelImports,
  // addLessLoader
} = require("customize-cra");

const addLessLoader = require('customize-cra-less-loader');

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
        cssLoaderOptions: {
          modules: {
            localIdentName: '[local]--[hash:base64:5]',
          },
        },
        lessLoaderOptions: {
          javascriptEnabled: true,
        },
      })
    )(config, env)
  // jest: (config) => config,
};
