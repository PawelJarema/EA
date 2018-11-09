const business = require('./business');

module.exports = temp_password => {
	return (`<html>
        <head>
            <style>
                .container { width: 500px; margin: auto; padding: 20px; }
                .head { background: #eee; padding: 20px 10px; text-align: center; } 
                p { padding: 0 10px; line-height: 1.7; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="head">
                    <h1>Hasło tymczasowe ${ business.name }!</h1>
                </div>
                <p>Twoje hasło tymczasowe:</p>
                <p><strong>${ temp_password }</strong></p>
                <p>Wklej je do odpowiedniego pola podczas logowania, potem zmień hasło w Ustawieniach. Bezpieczeństwo twoich danych jest dla nas ważne.</p>
                <p>Życzymy wielu udanych transakcji!</p>
                <p><b>Z poważaniem:</b><br/>
                   Zespół ${ business.name }</p>
            </div>
        </body>
    </html>`);
}