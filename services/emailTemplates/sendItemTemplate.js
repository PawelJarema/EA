const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = (name, phone, email, address, title, price, delivery_method, auction_id) => mainTemplate(
	`Wpłata`,
	`<p>Gratulujemy, kupujący dokonał wpłaty <b>${price} zł</b> za przedmiot <a href="${business.host}aukcje/${auction_id}">${title}</a>.</p>
	 <p>Dane kupującego:</p>
	 <div class='quote'>
	 	<p>${name}</p>
	 	<p>${email}</p>
	 	${ phone ? ('<p>tel: ' + phone + '</p>') : '' }
	 	<p>${address.street}</p>
	 	<p>${address.postal} ${address.city}</p>
	 	<p>Wybrana metoda dostawy: <b>${delivery_method}</b></p>
	 </div>
	 <p>Kupujący zapłacił, teraz Ty musisz wysłać przedmiot :)</p>`
);