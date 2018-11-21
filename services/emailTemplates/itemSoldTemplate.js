const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (auction_id, auction_title, winner, price) => mainTemplate(
	`Sprzedałeś przedmiot`,
	`<p>Gratulujemy, licytacja przedmiotu <a href="${business.host}aukcje/${auction_id}">${auction_title}</a> zakończyła się. ${winner} kupi od Ciebie przedmiot za ${price} zł.</p>`
);