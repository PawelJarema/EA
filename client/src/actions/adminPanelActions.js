import axios from 'axios';
import { TECH_BREAK, FETCH_MESSAGE } from './types';

export const techBreak = admin_id => async dispatch => {
	const res = await axios.post('/admin/tech-break', admin_id);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: TECH_BREAK, payload: res.data });
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}