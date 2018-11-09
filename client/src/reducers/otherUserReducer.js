import { FETCH_OTHER_USER } from '../actions/types';

export default function(state = null, action) {
	switch(action.type) {
		case FETCH_OTHER_USER:
			return action.payload || false;
		default:
			return state;
	}
};