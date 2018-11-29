const mainTemplate = require('./mainTemplate');

module.exports = title => mainTemplate(
	`Wiadomości`,
	`<p>W serwisie czekają na ciebie nowe wiadomości dotyczące aukcji "<strong>${title}</strong>".</p>`
);