export default function DateHelper(millis) {
	const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
	const date = new Date(millis);
	return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}