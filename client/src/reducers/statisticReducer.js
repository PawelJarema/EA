import { COUNT_AUCTIONS } from '../actions/types';

export default function(state = null, action) {
	switch(action.type) {
		case COUNT_AUCTIONS:
			return action.payload || false;
		default:
			return state;
	}
}