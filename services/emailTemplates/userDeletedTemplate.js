const mainTemplate = require('./mainTemplate');

module.exports = (reason) => mainTemplate(
	'Administracja',
	`<p>Twoje konto zostało usunięte przez administratora. Powód:</p>
	 <p><strong>${reason}</strong></p>
	 <p>Jeśli popełniliśmy błąd, koniecznie skontaktuj się z nami.</p>`
);