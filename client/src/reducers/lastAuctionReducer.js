import { NOTE_LAST_AUCTION } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case NOTE_LAST_AUCTION:
			return action.payload || false;
			// const payload = action.payload;
			// if (typeof payload === 'object' && payload.hasOwnProperty('title') && payload.hasOwnProperty('id')) {
			// 	return payload;
			// } else {
			// 	return false;
			// }
		default:
			return state;
	}
}