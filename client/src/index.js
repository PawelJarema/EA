import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import combinedReducers from './reducers';
import reduxThunk from 'redux-thunk';

const store = createStore(combinedReducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
    (<Provider store={store}>
        <App />
    </Provider>), 
    document.getElementById('root')
);
