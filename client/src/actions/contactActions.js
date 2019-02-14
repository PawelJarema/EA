import axios from 'axios';
import { FETCH_MESSAGE } from './types';

export const contactEaukcje = formData => async dispatch => {
	const res = await axios.post('/api/contact_eaukcje', formData);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}