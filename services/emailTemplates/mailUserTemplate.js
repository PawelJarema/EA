const mainTemplate = require('./mainTemplate');

module.exports = (subject, message) => mainTemplate(
	'Administracja',
	`<p>Administrator przesłał do Ciebie wiadomość:</p>
	 <div class='quote'>
	 	<p><strong>${subject}</strong></p>
	 	<p>${message}</p>
	 </div>
	 <p>Możesz skontaktować się z administratorem pisząc na E-mail serwisu.</p>
	`
);