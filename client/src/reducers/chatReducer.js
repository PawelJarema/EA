import { FETCH_CHATS } from '../actions/types';

export default function(state = null, action) {
	switch(action.type) {
		case FETCH_CHATS:
			return action.payload || false;
		default:
			return state;
	}
};