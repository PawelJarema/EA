const mainTemplate = require('./mainTemplate');

module.exports = title => mainTemplate(
	`Koniec licytacji`,
	`<p>Licytacja przedmiotu "<strong>${title}</strong>" w której brałeś udział została zakończona. Niestety, tym razem nie udało się wygrać.</p>`
);