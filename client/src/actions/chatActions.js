import axios from 'axios';
import { FETCH_CHATS } from './types';

export const fetchChats = () => async dispatch => {
	const res = await axios.get('/chats/get_all');
	dispatch({ type: FETCH_CHATS, payload: res.data });
};