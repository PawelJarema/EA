import axios from 'axios';
import React from 'react';
import { FETCH_AUCTIONS, FETCH_AUCTION, FETCH_MESSAGE, NOTE_LAST_AUCTION } from './types';

export const showSpinner = () => async dispatch => {
	dispatch({ type: FETCH_MESSAGE, payload: ({ type: 'ok', message: <i className="material-icons spinning">autorenew</i>  }) });
}

export const postPhotos = (formData) => async dispatch => {
    await axios.post('/auction/post_photos', formData);
}

export const updateAuction = (formData) => async dispatch => {
    const res = await axios.post('/auction/create_or_update', formData);
    const message_res = await axios.get('/api/flash_message');
    
    setTimeout(() => dispatch({ type: FETCH_MESSAGE, payload: message_res.data }), 1000);

    if (res.data) {
        dispatch({ type: NOTE_LAST_AUCTION, payload: res.data });
    }
}

export const buyNow = id => async dispatch => {
	const res = await axios.post('/auction/buy_now/' + id);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_AUCTION, payload: res.data });
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const postBid = (id, formData) => async dispatch => {
	const res = await axios.post('/auction/bid/' + id, formData);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_AUCTION, payload: res.data });
	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const likeAuction = (id, like) => async dispatch => {
	const res = await axios.post('/auction/like/' + id, { like });
}

export const fetchFrontPageAuctions = () => async dispatch => {
	const res = await axios.get('/auction/get_front_page_auctions');
	dispatch({ type: FETCH_AUCTIONS, payload: res.data });
}

export const filterAuctions = formData => async dispatch => {
	const res = await axios.post('/auction/filter', formData);
	dispatch({ type: FETCH_AUCTIONS, payload: res.data });
}

export const fetchAuctions = () => async dispatch => {
    const res = await axios.get('/auction/get_all');
    dispatch({ type: FETCH_AUCTIONS, payload: res.data });
}

export const editAuction = (id) => async dispatch => {
	const res = await axios.get('/auction/edit/' + id);
	dispatch({ type: FETCH_AUCTION, payload: res.data });
}

export const fetchAuction = (id) => async dispatch => {
	const res = await axios.get('/auction/get/' + id);
	dispatch({ type: FETCH_AUCTION, payload: res.data });
}

export const clearAuctions = () => async dispatch => {
	dispatch({ type: FETCH_AUCTIONS, payload: null });
}

export const clearAuction = () => async dispatch => {
	dispatch({ type: FETCH_AUCTIONS, payload: false });
	dispatch({ type: FETCH_AUCTION, payload: false });
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