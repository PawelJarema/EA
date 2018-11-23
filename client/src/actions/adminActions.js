import axios from 'axios';
import { AUTH_ADMIN, FETCH_ADMIN, FETCH_DOCUMENTS, FETCH_MESSAGE } from './types';

export const deleteAuctionAndPaginate = data => async dispatch => {
	const res = await axios.post('/api/delete_auction', data);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_DOCUMENTS, payload: res.data });
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const bulkSendMail = formData => async dispatch => {
	const res = await axios.post('/api/mail_all_users', formData);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const mailUser = formData => async dispatch => {
	const res = await axios.post('/api/mail_user', formData);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const deleteUserAndPaginate = data => async dispatch => {
	const res = await axios.post('/api/delete_user', data);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_DOCUMENTS, payload: res.data });
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const paginateDocuments = data => async dispatch => {
	const res = await axios.post('/api/fetch_documents', data);

	dispatch({ type: FETCH_DOCUMENTS, payload: res.data });
}

export const postProvision = data => async dispatch => {
	const res = await axios.post('/api/provision', data);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_ADMIN, payload: res.data });
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
};

export const authAdmin = formData => async dispatch => {
	const res = await axios.post('/auth/admin', formData);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: AUTH_ADMIN, payload: res.data });
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const logoutAdmin = () => async dispatch => {
	await axios.post('/auth/admin/logout');
	dispatch({ type: AUTH_ADMIN, payload: false });
}