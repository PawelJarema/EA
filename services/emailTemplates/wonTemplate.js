const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (auction_id, auction_title, price) => mainTemplate(
	`Zakończenie licytacji`,
	`<p>Gratulujemy, wygrałeś licytację <a href="${business.host}aukcje/${auction_id}">${auction_title}</a>. Dokonaj przedpłaty ${price} zł, aby sprzedawca mógł wysłać towar. Pamiętaj, że nie przekażemy twoich środków Sprzedawcy, dopóki nie odbierzesz towaru i nie potwierdzisz jego zgodności z opisem.</p>`
);