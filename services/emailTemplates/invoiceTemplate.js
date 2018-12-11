function invoice_date(millis) {
	const date = new Date(millis);
	return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

function invoice_number(millis, title) {
	const date = new Date(millis);
	return `EA-${ title.split(' ').slice(0,4).map(word => word.slice(0, 1).toUpperCase()).join('')}/${date.getYear()}/${date.getMonth() + 1}/${date.getDate() }`;
}

function invoice_data(user) {
	return (`
		<div class="pesel">
			Pesel: ${ user.pesel }
		</div>
		<div class="address">
			<span>${ user.address.street }</span>
			<span>${ user.address.postal }</span>
			<span>${ user.address.city }</span>
		</div>
		<div class="contact">
			<div>E-mail: ${ user.contact.email }</div>
			${ (user.contact.phone ? ('<div>Telefon: ' + user.contact.phone + '</div>') : '') }
		</div>
	`);
}

function user_name(user) {
	return `${user.firstname || ''} ${user.lastname || (user.firstname ? '' : 'Anonim') }`;
}


module.exports = (seller, buyer, transaction, vat) => {
	const vat_value = vat ? ((+transaction.price + transaction.delivery_price) * 0.23) : 0;

	return (
		`<html>
            <head>
                <style>
             	   .invoice { padding: 20px; }
                   .number, .date { opacity: 0.5; }
                   h1 { margin-top: 0px; }
                   .usertype { margin-top: 30px; margin-bottom: 0px; opacity: 0.8; }
                   table { margin: 40px 0px; }
                   table td { padding: 10px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="invoice">
                	<div class="number">Faktura: ${ invoice_number(transaction.date, transaction.title) }</div>
                	<div class="date">Data: ${ invoice_date(transaction.date) }</div>

                	<div class="usertype">Wystawca:</div>
                	<h1>${ user_name(seller) }</h1>
                	<div class="data">
                		${ invoice_data(seller) }

                	</div>
                	<div class="bank">
                		<div class="account">
                			Konto: <b>${ seller.balance.account_number }</b>
                		</div>
                	</div>


                	<div class="usertype">Odbiorca:</div>
                	<h1>${ user_name(buyer) }</h1>
                    <div class="data">
                		${ invoice_data(buyer) }
                	</div>

              		<table>
              			<thead>
              				<tr>
              					<th>Opis</th>
              					<th>Ilość</th>
              					<th>Cena netto</th>
              					<th>VAT</th>
              					<th>Do zapłaty</th>
              				</tr>
              			</thead>
              			<tbody>
              				<tr>
		              			<td>${ transaction.title } z dostawą</td>
		              			<td>${ transaction.qty || 1}</td>
		              			<td>${ (+transaction.price + +transaction.delivery_price) - vat_value } zł</td>
		              			<td>${ vat ? '23%' : '0%' }</td>
		              			<td>${ (+transaction.price + +transaction.delivery_price) } zł</td>
              				</tr>
              			</tbody>
              		</table>

              		<p>Uprzejmie prosimy o opłacenie faktury najpóźniej w ciągu tygodnia. Dziękujemy!</p>
                </div>
            </body>
        </html>`
	);
}