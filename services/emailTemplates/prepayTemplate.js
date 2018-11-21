const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = title => mainTemplate(
	'Przedpłata',
	`<p>Niedawno wygrałeś licytację przedmiotu <strong>${title}</strong>. Przedmiot już czeka na Ciebie. <a href=${business.host}moje-licytacje/zakonczone>Dokonaj przedpłaty</a>, aby Sprzedawca mógł go wysłać.`
);