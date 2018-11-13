import axios from 'axios';
import { FETCH_OTHER_USER, FETCH_MESSAGE } from './types';

export const postQuestion = (formData) => async dispatch => {
	const res = await axios.post('/chats/message', formData);
	const message = await axios.get('/api/flash_message');
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
};

export const fetchOtherUser = (id) => async dispatch => {
	const res = await axios.get('/other_user/' + id);
	dispatch({ type: FETCH_OTHER_USER, payload: res.data });
};