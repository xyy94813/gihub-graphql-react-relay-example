
const fs = require("fs-extra")
const path = require('path')
const fetch = require('node-fetch');
const dotenv = require('dotenv')
const { introspectionQuery } = require('graphql/utilities/introspectionQuery')

function getConfByDotenv(suffix = '') {
  try {
    return dotenv.parse(fs.readFileSync(`.env${suffix}`));
  } catch (e) {
    return {}
  }
}

function getEnvironmentArg () {
  let arg = process.argv.find(item => item.includes('--env'));
  if (arg) {
    return arg.split('=')[1];
  }
  return 'development';
}

function getConf() {
  const env = getEnvironmentArg();
  console.log(`env is ${env}`)

  return {
    ...getConfByDotenv(),
    ...getConfByDotenv('.local'),
    ...getConfByDotenv(`.${env}`),
    ...getConfByDotenv(`.${env}.local`),
  }  
}

const CONF = getConf();

console.log('Update schema start')

const postData = JSON.stringify({
  'query': introspectionQuery,
});

fetch(`https://api.github.com/graphql`, {
  method: 'post',
  body: postData,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `bearer ${CONF.REACT_APP_GITHUB_API_TOKEN}`
  }
})
.then(res => {
  if (!res.ok) {
    throw Error(`[NetWorkError]: ${res.status} - ${res.statusText}`)
  }
  return res
})
.then(res => res.json())
.then(schema => {
  const schema_file_path = path.resolve(__dirname, '..', 'data', 'schema.json')
  console.log('write new schema in ' + schema_file_path)
  fs.writeFileSync(schema_file_path, JSON.stringify(schema))
  console.log('Update schema success');
})
.catch((e) => {
  console.error(`Update schema failed with: ${e.message || e}`);
})
