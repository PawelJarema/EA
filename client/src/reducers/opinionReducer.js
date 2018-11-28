import { FETCH_OPINIONS } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case FETCH_OPINIONS:
			return action.payload || false;
		default:
			return state;
	}
}