import axios from 'axios';
import { FETCH_USER, FETCH_MESSAGE, NOTE_LAST_AUCTION } from './types';

export const postProfile = (formData) => async dispatch => {
    const user_res = await axios.post('/user/update', formData);
    const message_res = await axios.get('/api/flash_message');
    
    await dispatch({ type: FETCH_MESSAGE, payload: message_res.data });
    await dispatch({ type: FETCH_USER, payload: user_res.data });
}

export const newAuction = (formData) => async dispatch => {
    const res = await axios.post('/auction/create_or_update', formData);
    const message_res = await axios.get('/api/flash_message');
    
    dispatch({ type: FETCH_MESSAGE, payload: message_res.data });

    const user = await axios.get('/api/current_user');
    dispatch({ type: FETCH_USER, payload: user.data });

    if (res.data) {
        dispatch({ type: NOTE_LAST_AUCTION, payload: res.data });
    }
}

export const postDeliveries = (formData) => async dispatch => {
    const res = await axios.post('/user/delivery', formData);
    const message_res = await axios.get('/api/flash_message');
    
    await dispatch({ type: FETCH_MESSAGE, payload: message_res.data });
    await dispatch({ type: FETCH_USER, payload: res.data });
}