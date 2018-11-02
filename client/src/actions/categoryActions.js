import axios from 'axios';
import { FETCH_CATEGORIES } from './types';

export const fetchCategories = () => async dispatch => {
    const res = await axios.get('/api/categories');
    dispatch({ type: FETCH_CATEGORIES, payload: res.data });
}