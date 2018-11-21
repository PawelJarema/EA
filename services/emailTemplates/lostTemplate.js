const mainTemplate = require('./mainTemplate');

module.exports = title => mainTemplate(
	`Zakończenie licytacji`,
	`<p>Licytacja przedmiotu "<strong>${title}</strong>" w której brałeś udział została zakończona. Niestety, tym razem nie udało się wygrać.</p>`
);