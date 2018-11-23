import { AUTH_ADMIN, FETCH_ADMIN } from '../actions/types';

export default function(state = null, action) {
	switch (action.type) {
		case AUTH_ADMIN:
			return action.payload || false;
		case FETCH_ADMIN:
			return action.payload || false;
		default:
			return state;
	}
}