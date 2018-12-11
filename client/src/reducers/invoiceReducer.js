import { FETCH_INVOICES } from '../actions/types';

export default function (state = null, action) {
	switch (action.type) {
		case FETCH_INVOICES:
			return action.payload || false;
		default:
			return state;
	}
}