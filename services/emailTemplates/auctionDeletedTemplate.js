const mainTemplate = require('./mainTemplate');

module.exports = (title, reason) => mainTemplate(
	'Administracja',
	`<p>Aukcja przedmiotu ${title} została usunięta przez administratora. Powód:</p>
	 <p><strong>${reason}</strong></p>
	 <p>Jeśli popełniliśmy błąd, koniecznie skontaktuj się z nami.</p>`
);