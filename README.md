# A demo with github api V4 and react-relay

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Step 1

Install all dependencies by `yarn`

```
yarn
```

## Step 2

Generate `.env.local` and Configure ENV

```
GITHUB_API_TOKEN=${your github token}
```

## Step 3

Upgrade Github graphql schema

```
yarn run schema
```

## Step 4 

Generate `*.graphql.js`

```
yarn run relay
```

## Dev

```
yarn start
```
  
## Production

```
yarn run build
```
  
## Test

```
yarn run test
```

## ENV_KEY

```
# your github token
GITHUB_API_TOKEN
```  
