import React from 'react';
import axios from 'axios';
import { FETCH_CATEGORIES, FETCH_MESSAGE } from './types';

export const fetchCategories = () => async dispatch => {
    const res = await axios.get('/api/categories');
    dispatch({ type: FETCH_CATEGORIES, payload: res.data });
}

export const postCategoryTree = (tree) => async dispatch => {
	dispatch({ type: FETCH_MESSAGE, payload: ({ type: 'ok', message: <i className="material-icons spinning">autorenew</i> }) });

	const res = await axios.post('/api/post_categories', tree);
	const message = await axios.get('/api/flash_message');

	dispatch({ type: FETCH_MESSAGE, payload: message.data });
}

export const resetCategories = () => async dispatch => {
	dispatch({ type: FETCH_MESSAGE, payload: ({ type: 'ok', message: <i className="material-icons spinning">autorenew</i> }) });
	const res = await axios.post('/api/reconstruct-categories');
}