import { FETCH_EMAILS } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_EMAILS:
            return action.payload || false;
        default:
            return state;
    }
}