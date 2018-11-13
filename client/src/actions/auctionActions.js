import axios from 'axios';
import { FETCH_AUCTIONS, FETCH_AUCTION } from './types';

export const fetchFrontPageAuctions = () => async dispatch => {
	const res = await axios.get('/auction/get_front_page_auctions');
	dispatch({ type: FETCH_AUCTIONS, payload: res.data });
}

export const fetchAuctions = () => async dispatch => {
    const res = await axios.get('/auction/get_all');
    dispatch({ type: FETCH_AUCTIONS, payload: res.data });
}

export const fetchAuction = (id) => async dispatch => {
	const res = await axios.get('/auction/get/' + id);
	dispatch({ type: FETCH_AUCTION, payload: res.data });
}

export const paginate = (page, items_per_page, options) => async dispatch => {
	let query = '';

	if (options) {
		const category = options.category;
		const query_text = options.query;

		const min = options.min;
		const max = options.max;
		const state = options.state;
		const sort = options.sort;
		
		if (min || max || state || sort) {
			query = `/auction/advanced_search/${category}/${query_text}/${min}/${max}/${state}/${sort}/${page}/${items_per_page}`;
		} else {
			query = `/auction/search/${category}/${query_text}/${page}/${items_per_page}`
		}
	} else {
		query = `/auction/get_all/${page}/${items_per_page}`;
	}

	const res = await axios.get(query);
	dispatch({ type: FETCH_AUCTIONS, payload: res.data });
}