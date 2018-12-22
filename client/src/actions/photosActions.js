import axios from 'axios';
import { FETCH_PHOTOS } from './types';

export const clearPhotos = () => async dispatch => {
	dispatch({ type: FETCH_PHOTOS, payload: false });
}

export const fetchPhotos = (id) => async dispatch => {
	const res = await axios.get(`/auction/${id}/photos`);
	dispatch({ type: FETCH_PHOTOS, payload: res.data });
}
