import axios from 'axios';
import { EXPORTED_AUCTION, FETCH_MESSAGE } from './types';

export const exportAuction = id => async dispatch => {
	const res = await axios.post('/import_export/export', { id });

	dispatch({ type: EXPORTED_AUCTION, payload: res.data });
}

export const clearExported = id => async dispatch => {
	dispatch({ type: EXPORTED_AUCTION, payload: false });
}

export const importAuction = formData => async dispatch => {
	const res = await axios.post('/import_export/import', formData);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}