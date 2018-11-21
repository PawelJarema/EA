import { FETCH_AUCTIONS, FETCH_AUCTION } from '../actions/types';

export default function (state = null, action) {
    switch (action.type) {
        case FETCH_AUCTIONS:
            return action.payload || false;
        case FETCH_AUCTION:
        	return action.payload || false;
        default:
            return state;
    }
}