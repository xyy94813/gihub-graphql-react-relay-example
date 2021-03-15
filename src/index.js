import ReactDOM from 'react-dom';

import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

const mountNode = document.getElementById('root');

ReactDOM.render(<App />, mountNode);

registerServiceWorker();
