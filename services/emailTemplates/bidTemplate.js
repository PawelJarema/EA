const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (id, title, text, price) => mainTemplate(
	`Licytacja`,
	`<p>Zalicytowałeś w aukcji przedmiotu <a href="${business.host}aukcje/${id}">${title}</a> za ${ price } zł. ${text}</p>`
);