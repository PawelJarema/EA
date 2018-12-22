import axios from 'axios';
import { FETCH_COOKIES, FETCH_MESSAGE } from './types';

async function displayMessages(dispatch) {
	const message = await axios.get('/api/flash_message');
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const allowCookies = () => async dispatch => {
	const res = await axios.post('/api/allow_cookies');
	dispatch({ type: FETCH_COOKIES, payload: res.data });
	displayMessages(dispatch);
}

export const fetchCookies = chat_id => async dispatch => {
	const res = await axios.get('/api/cookies');
	dispatch({ type: FETCH_COOKIES, payload: res.data });
}