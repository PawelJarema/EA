import { FETCH_DOCUMENTS } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case FETCH_DOCUMENTS:
			return action.payload || false;
		default:
			return state;
	}
}