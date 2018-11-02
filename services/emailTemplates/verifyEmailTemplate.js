const business = require('./business');

module.exports = id => {
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
                    <h1>Witamy w serwisie ${ business.name }!</h1>
                </div>
                <p>Cieszymy się, że jesteś z nami. Aby rozpocząć korzystanie z serwisu, potwierdź rejestrację klikając w poniższy link:</p>
                <p><a href="${ business.host }auth/email/verify/${ id }">Potwierdź adres email.</a></p>
                <p>Życzymy wielu udanych transakcji!</p>
                <p><b>Z poważaniem:</b><br/>
                   Zespół ${ business.name }</p>
            </div>
        </body>
    </html>`);
};