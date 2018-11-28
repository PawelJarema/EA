import axios from 'axios';
import { FETCH_OPINIONS } from './types';

export const fetchOpinions = data => async dispatch => {
	const res = await axios.post('/other_user/opinions', data);
	dispatch({ type: FETCH_OPINIONS, payload: res.data });
}