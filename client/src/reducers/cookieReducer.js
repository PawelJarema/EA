import { FETCH_COOKIES } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case FETCH_COOKIES:
			return action.payload || false;
		default:
			return state;
	}
}