import axios from 'axios';
import { PING_PRZELEWY_24 } from './types';

export const pingPrzelewy24 = () => async dispatch => {
	const res = await axios.post('/przelewy24/ping');
	console.log('odpowiedz z Przelewy24:', res);
}

export const registerP24Transaction = () => async dispatch => {
	const res = await axios.post('/przelewy24/registerTransaction');
	console.log('transactions', res.data);
}