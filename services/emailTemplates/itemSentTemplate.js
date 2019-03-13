const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (auction_id, title) => mainTemplate(
	`Wysyłka`,
	`<p>Sprzedawca wysłał do Ciebie przedmiot <a href="${business.host}aukcje/${auction_id}">${ title }</a>.</p>
	 <p>Wkrótce powinienieś odebrać przesyłkę.</p>`
);