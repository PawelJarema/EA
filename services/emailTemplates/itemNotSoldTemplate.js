const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (auction_id, auction_title) => mainTemplate(
	`Aukcja zakończona`,
	`<p>Zakończyła się licytacja przedmiotu <a href="${business.host}aukcje/${auction_id}">${auction_title}</a>. Niestety, nie udało się go sprzedać.</p>`
);