import axios from 'axios';
import { FETCH_EMAILS } from './types';

export const fetchEmails = () => async dispatch => {
    const res = await axios.get('/auth/emails');
    dispatch({ type: FETCH_EMAILS, payload: res.data });
}