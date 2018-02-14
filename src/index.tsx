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
        enthusiasmLevel: 1,
        languageName: 'TypeScript',
        pseudo: 'pseudo'
    },
    // window.__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </Provider>,
    document.getElementById('root') as HTMLElement
);
