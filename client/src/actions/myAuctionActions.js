import axios from 'axios';
import { FETCH_MY_AUCTIONS, FETCH_MESSAGE } from './types';

export const rateAuction = data => async dispatch => {
	const res = await axios.post('/auction/rate', data);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
	//dispatch({ type: FETCH_AUCTIONS, payload: res.data });
}

export const clearPagination = () => async dispatch => {
	dispatch ({ type: FETCH_MY_AUCTIONS, payload: 'empty' });
}

export const paginate = (page, items_per_page) => async dispatch => {
	const res = await axios.post(`/auction/my_auctions/${page}/${items_per_page}`);
	dispatch ({ type: FETCH_MY_AUCTIONS, payload: res.data });
}

export const paginateEnded = (page, items_per_page) => async dispatch => {
	const res = await axios.post(`/auction/my_auctions/${page}/${items_per_page}`, { mode: 'ended' });
	dispatch ({ type: FETCH_MY_AUCTIONS, payload: res.data });
}

export const paginateBids = (page, items_per_page) => async dispatch => {
	const res = await axios.post(`/auction/my_bids/${page}/${items_per_page}`);
	dispatch ({ type: FETCH_MY_AUCTIONS, payload: res.data });
}

export const paginateEndedBids = (page, items_per_page) => async dispatch => {
	const res = await axios.post(`/auction/my_bids/${page}/${items_per_page}`, { mode: 'ended'} );
	dispatch ({ type: FETCH_MY_AUCTIONS, payload: res.data });
}

export const deleteAuctionThenFetchMyAuctions = (id, page, items_per_page) => async dispatch => {
	await axios.post(`/auction/delete/${id}`);
	const res = await axios.post(`/auction/my_auctions/${page}/${items_per_page}`);
	const message = await axios.get('/api/flash_message');

	dispatch ({ type: FETCH_MY_AUCTIONS, payload: res.data });
	dispatch ({ type: FETCH_MESSAGE, payload: message.data });
}