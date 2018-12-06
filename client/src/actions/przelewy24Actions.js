import axios from 'axios';
import { PING_PRZELEWY_24 } from './types';

export const pingPrzelewy24 = () => async dispatch => {
	const res = await axios.post('/przelewy24/ping');
}

export const registerP24Transaction = (data) => async dispatch => {
	const P24url = await axios.post('/przelewy24/registerTransaction', data);
	
	window.location.href = P24url.data;
}