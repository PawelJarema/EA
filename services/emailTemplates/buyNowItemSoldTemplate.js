const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (id, title, name, price) => mainTemplate(
	`Sprzedaż`,
	`<p>${name} kupi od Ciebie <a href="${business.host}aukcje/${id}">${title}</a> za cenę Kup Teraz ${price} zł. Gratulujemy!</p>`
);