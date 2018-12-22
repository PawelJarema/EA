import { FETCH_PHOTOS } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case FETCH_PHOTOS:
			return action.payload || false;
		default:
			return state;
	}
}