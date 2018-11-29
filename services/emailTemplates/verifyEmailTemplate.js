const mainTemplate = require('./mainTemplate');
const business = require('./business');

module.exports = id => mainTemplate(
    `Powitanie`,
    `<p>Cieszymy się, że jesteś z nami. Aby rozpocząć korzystanie z serwisu, potwierdź rejestrację klikając w poniższy link:</p>
     <p><a href="${ business.host }auth/email/verify/${ id }">Potwierdź adres email.</a></p>`
);