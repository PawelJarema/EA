import axios from 'axios';
import { PING_PRZELEWY_24, FETCH_MESSAGE } from './types';

export const pingPrzelewy24 = () => async dispatch => {
	const res = await axios.post('/przelewy24/ping');
}

export const registerP24Transaction = data => async dispatch => {
	const P24url = await axios.post('/przelewy24/registerTransaction', data);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
	
	if (P24url.data !== true) window.location.href = P24url.data;
}

export const buyCredits = data => async dispatch => {
	const P24url = await axios.post('/przelewy24/buyCredits', data);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
	
	window.location.href = P24url.data;
}