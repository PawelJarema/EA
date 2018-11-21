const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = title => mainTemplate(
	'Wystaw opinię',
	`<p>Niedawno kupiłeś przedmiot <strong>${title}</strong>. <a href=${business.host}moje-licytacje/zakonczone>Wystaw opinię Sprzedawcy</a>.`
);