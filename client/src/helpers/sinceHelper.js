export default function SinceHelper(millis) {
	if (!millis) 
		millis = new Date((Math.random() * (new Date().getTime() - 60000) + 60000)).getTime();

	const years = ['rok', 'lata', 'lat'];
	const months = ['miesiąc', 'miesiące', 'miesięcy'];
	const days = ['dzień', 'dni'];
	const hours = ['godzinę', 'godziny', 'godzin'];

	const format = (num, arr) => {
		if (num <= 0) return '';
		if (num === 1) return `${num} ${arr[0]}`;
		if (num > 1 && num < 5 || num > 21 && num % 10 > 1 && num % 10 < 5) return `${num} ${arr[1] }`;
		return `${num} ${arr[2] || arr[1]}`;
	}

	const since = millis;

	const hour = 1000 * 60 * 60;
	const day = hour * 24;
	const month = day * 30;
	const year = day * 365;

	const isYears = parseInt(since / year);
	const isMonths = parseInt((since - isYears * year) / month);
	const isDays = parseInt((since - isYears * year - isMonths * month) / day);
	const isHours = parseInt((since - isYears * year - isMonths * month - isDays * day) / hour);

	const string = `${format(isYears, years)} ${format(isMonths, months)} ${format(isDays, days)} ${format(isHours, hours)}`;
	return !string.trim() ? 'mniej niż 1h' : string;
};