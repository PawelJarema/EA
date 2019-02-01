import 'react-app-polyfill/ie11';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import combinedReducers from './reducers';
import reduxThunk from 'redux-thunk';

var ua = window.navigator.userAgent;

var ie = ua.indexOf('MSIE ') > 0;
var ie_new = ua.indexOf('Trident/') > 0;
var edge = ua.indexOf('Edge/') > 0;

if (ie || ie_new) {
	var info = document.getElementById('user-agent');

	var h1 = document.createElement('h1')
	var p = document.createElement('p');
	var a = document.createElement('a');
	a.href = 'https://www.google.com/chrome/';

	var heading = document.createTextNode('Nieobsługiwana przeglądarka');
	var paragraph = document.createTextNode('Eaukcje nie działają na przeglądarkach z rodziny Internet Explorer');
	var link = document.createTextNode('Pobierz zaufaną przeglądarkę');

	h1.appendChild(heading);
	p.appendChild(paragraph);
	a.appendChild(link);

	info.appendChild(h1);
	info.appendChild(p);
	info.appendChild(a);
} else {
	const store = createStore(combinedReducers, {}, applyMiddleware(reduxThunk));

	ReactDOM.render(
	    (<Provider store={store}>
	        <App />
	    </Provider>), 
	    document.getElementById('root')
	);
}



