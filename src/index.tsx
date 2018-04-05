import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { HashRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { reducer } from './reducers';
import { StoreState } from './types';
import { Provider } from 'react-redux';

const store = createStore<StoreState>(
    reducer,
    {
        pseudo: '',
        results: [],
        scores: [],
        nbRounds: 0
    },
    // window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <HashRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </HashRouter>,
    document.getElementById('root') as HTMLElement
);
