import { TECH_BREAK } from '../actions/types';

export default function (state = null, action) {
	switch (action.types) {
		case TECH_BREAK:
			return action.payload || false;
		default:
			return state;
	}
}