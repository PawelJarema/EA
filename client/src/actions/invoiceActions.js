import axios from 'axios';
import { FETCH_INVOICES, FETCH_MESSAGE } from './types';

export const paginateInvoices = (page, per_page) => async dispatch => {
	const res = await axios.post('/invoices/fetch_invoices', { page, per_page });
	dispatch({ type: FETCH_INVOICES, payload: res.data });
}

export const sendInvoice = (id, vat) => async dispatch => {
	const res = await axios.post('/invoices/send', { id, vat });
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}