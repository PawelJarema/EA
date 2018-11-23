import { TECH_BREAK, FETCH_TECH_BREAK } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case TECH_BREAK:
			return action.payload || false;
		case FETCH_TECH_BREAK:
			return action.payload || false;
		default:
			return state;
	}
}