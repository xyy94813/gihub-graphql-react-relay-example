import React from 'react';
import ReactDOM from 'react-dom';
import {
  QueryRenderer,
  graphql,
} from 'react-relay';

import 'antd/dist/antd.css';
import './index.css';
import modernEnvironment from './createRelayEnvironment';
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

const mountNode = document.getElementById('root');

function RenderApp({error, props}) {
  if (error) {
    return <div>{error.message}</div>
  } else if (props) {
    return <App data={props}/>
  } else {
    return <div>Loading</div>
  }
}

ReactDOM.render(
  <QueryRenderer
    environment={modernEnvironment}
    query={
       graphql`
        query srcQuery {
          ...App_data
        }
      `
    }
    variables={{}}
    render={RenderApp}
  />,
  mountNode
);

registerServiceWorker();
