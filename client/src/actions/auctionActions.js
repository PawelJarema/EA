import axios from 'axios';
import { FETCH_AUCTIONS } from './types';

export const fetchAuctions = () => async dispatch => {
    const res = await axios.get('/auction/get_all');
    dispatch({ type: FETCH_AUCTIONS, payload: res.data });
}