import axios from 'axios';
import { FETCH_CHATS } from './types';

export const readAllMessages = chat_id => async dispatch => {
	const res = await axios.post('/chats/read_all_messages', { chat_id });
}

export const fetchChats = () => async dispatch => {
	const res = await axios.get('/chats/get_all');
	dispatch({ type: FETCH_CHATS, payload: res.data });
};

export const postMessage = (formData) => async dispatch => {
	const res = await axios.post('/chats/chat_message', formData);
	dispatch({ type: FETCH_CHATS, payload: res.data });
};