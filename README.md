# A demo with github api V4 and react-relay

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## Step 1

Install all dependencies by `npm`

```
npm i
```

## Step 2

Generate `.env.local` and Configure ENV

```
REACT_APP_GITHUB_API_TOKEN=${your github token}
```

## Step 3

Upgrade Github graphql schema `npm run updateSchema`

```
// such as
npm run updateSchema
```

## Step 4

Generate `*.graphql.js`

```
npm run relay
```

## Dev

```
npm start
```

## Production

```
npm run build
```

## Test

```
npm run test
```

## ENV_KEY

```
# your github token
REACT_APP_GITHUB_API_TOKEN
```
