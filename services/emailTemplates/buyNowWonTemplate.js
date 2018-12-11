const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (id, title, price) => mainTemplate(
	`Kup Teraz`,
	`<p>Gratulujemy. Kupiłeś Teraz przedmiot <a href="${business.host}aukcje/${id}">${title}</a>. Dokonaj przedpłaty ${price} zł, aby sprzedawca mógł wysłać towar.</p>`
);