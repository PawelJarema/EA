import axios from 'axios';
import { FETCH_MESSAGE } from './types';

export const fetchMessage = () => async dispatch => {
    const res = await axios.get('/api/flash_message');
    dispatch({ type: FETCH_MESSAGE, payload: res.data });
};

export const clearMessage = () => async dispatch => {
	dispatch({ type: FETCH_MESSAGE, payload: false });
}