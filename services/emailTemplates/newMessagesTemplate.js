const mainTemplate = require('./mainTemplate');

module.exports = title => mainTemplate(
	`Nowe wiadomości`,
	`<p>W serwisie czekają na ciebie nowe wiadomości dotyczące aukcji "<strong>${title}</strong>".</p>`
);