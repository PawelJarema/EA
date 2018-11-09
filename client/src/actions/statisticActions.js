import axios from 'axios';
import { COUNT_AUCTIONS } from './types';

export const countAuctions = category => async dispatch => {
	const res = await axios.get('/auction/count/' + category);
	dispatch({ type: COUNT_AUCTIONS, payload: res.data });
};