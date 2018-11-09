import axios from 'axios';
import { FETCH_OTHER_USER } from './types';

export const fetchOtherUser = (id) => async dispatch => {
	const res = await axios.get('/other_user/' + id);
	dispatch({ type: FETCH_OTHER_USER, payload: res.data });
};