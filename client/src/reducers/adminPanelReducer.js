import { TECH_BREAK } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case TECH_BREAK:
			return action.payload || false;
		default:
			return state;
	}
}