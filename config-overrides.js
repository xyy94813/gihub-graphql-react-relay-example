const { 
  injectBabelPlugin, 
  // getLoader, 
  // loaderNameMatches, 
} = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');

// function rewriteCssLoaderOptions (options, config) {
//   const cssLoader = getLoader(config.module.rules, (rule) => loaderNameMatches(rule, 'css-loader'));
//   cssLoader.options = {
//     ...cssLoader.options,
//     ...options
//   };
// }

module.exports = function override(config, env) {
  // rewriteCssLoaderOptions({
  //   // modules: true,
  // }, config);

  config = injectBabelPlugin('relay', config);
  config = injectBabelPlugin([
    'module-resolver',
    {
      'alias': {
        '@': './src'
      }
    }
  ], config);
  config = injectBabelPlugin([
    'import',
    {
      'libraryName': 'antd',
      'style': true
    }
  ], config);
  config = rewireLess(config, env);
  //do stuff with the webpack config...
  return config;
}