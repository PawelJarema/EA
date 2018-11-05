import axios from 'axios';
import { FETCH_USER, FETCH_MESSAGE } from './types';

export const postProfile = (formData) => async dispatch => {
    const user_res = await axios.post('/user/update', formData);
    const message_res = await axios.get('/api/flash_message');
    
    await dispatch({ type: FETCH_MESSAGE, payload: message_res.data });
    await dispatch({ type: FETCH_USER, payload: user_res.data });
}