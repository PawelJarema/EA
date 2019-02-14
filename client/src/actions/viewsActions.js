import axios from 'axios';

export const registerView = auction_id => async dispatch => {
	const res = axios.post(`/api/register_viewer/${auction_id}`);
}

export const unregisterView = auction_id => async dispatch => {
	const res = axios.post(`/api/unregister_viewer/${auction_id}`);
}

export const addView = auction_id => async dispatch => {
	const res = axios.post(`/api/add_view_for/${auction_id}`);
}