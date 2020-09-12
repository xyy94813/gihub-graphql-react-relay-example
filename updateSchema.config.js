
const dotenvLoad = require('dotenv-load');
const path = require('path');

dotenvLoad();

module.exports = {
  point: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_API_TOKEN}`,
  },
  type: 'graphql', // or graphql
  output: path.join(__dirname, 'data', 'schema.docs.graphql'),
};
