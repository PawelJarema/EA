const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (id, title, text) => mainTemplate(
	`Licytacja`,
	`<p>Podbiłeś cenę w licytacji przedmiotu <a href="${business.host}aukcje/${id}">${title}</a>. ${text}</p>`
);