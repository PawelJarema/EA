import { FETCH_MY_AUCTIONS } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case FETCH_MY_AUCTIONS:
			return action.payload || false;
		default:
			return state;
	}
};