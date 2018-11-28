const mainTemplate = require('./mainTemplate');

module.exports = (title, reason) => mainTemplate(
	'Wiadomości',
	`<p>W serwisie czekają na Ciebie nieprzeczytane wiadomości od innych użytkowników.</p>`
);