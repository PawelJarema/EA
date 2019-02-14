const mainTemplate = require('./mainTemplate');

module.exports = (email, message) => mainTemplate(
	'Pomoc',
	`<p>Użytkownik portalu przesłał wiadomość z formularza pomocy eaukcje.pl</p>
	 <div class='quote'>
	 	<p>${email}</p>
	 	<p>${message}</p>
	 </div>
	 <p>Prosi o szybką odpowiedź.</p>
	`
);