import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { reducer } from './reducers';
import { StoreState } from './types';
import { Provider } from 'react-redux';

const store = createStore<StoreState>(
    reducer,
    {
        pseudo: ''
    },
    // window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <App/>
        </Provider>
    </BrowserRouter>,
    document.getElementById('root') as HTMLElement
);
