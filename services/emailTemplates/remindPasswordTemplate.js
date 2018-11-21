const mainTemplate = require('./mainTemplate');

module.exports = temp_password => mainTemplate(
    `Hasło tymczasowe`,
    `<p>Twoje hasło tymczasowe:</p>
     <p><strong>${ temp_password }</strong></p>
     <p>Wklej je do odpowiedniego pola podczas logowania, potem zmień hasło w Ustawieniach. Bezpieczeństwo twoich danych jest dla nas ważne.</p>`
);
                