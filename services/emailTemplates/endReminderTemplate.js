const mainTemplate = require('./mainTemplate');

module.exports = (title, isWinner) => mainTemplate(
	`Ostatnie minuty`,
	`<p>Aukcja przedmiotu "<strong>${title}</strong>" zakończy się za pół godziny. ${ isWinner ? 'W tej chwili prowadzisz w licytacji.' : 'Obecnie prowadzi ktoś inny. Zalicytuj, aby przejąć prowadzenie.' } </p>`
);