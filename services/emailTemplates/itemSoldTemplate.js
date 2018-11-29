const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (auction_id, auction_title, names, price) => mainTemplate(
	`Sprzedaż`,
	`<p>Gratulujemy, licytacja przedmiotu <a href="${business.host}aukcje/${auction_id}">${auction_title}</a> zakończyła się. ${ (names.length === 1 ? `${names[0]} kupi` : (names.reduce((n1, n2) => `${n1}, ${n2}` ) + ' kupią')) } od Ciebie przedmiot powyżej ustalonej przez Ciebie ceny minimalnej ${price} zł.</p>`
);