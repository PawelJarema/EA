import SinceHelper from './sinceHelper';

export default function AuctionEndHelper(date) {
	date = date || {};
	const day = 1000 * 60 * 60 * 24;

	return SinceHelper((date.start_date + day * date.duration) - new Date().getTime(), ['godzina', 'godziny', 'godzin']);
};