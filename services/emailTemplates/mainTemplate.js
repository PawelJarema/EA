const business = require('./business');
const footer = `Copyright © 2018 <a href="${business.host}">Eaukcje.pl.</a> Wszelkie prawa zastrzeżone.`;

module.exports = (title, content) => {
	return (
        `<html>
            <head>
                <style>
                    .container { width: 550px; margin: auto; padding: 20px; }
                    .head { margin-bottom: 60px; padding: 20px 10px; text-align: left; border-bottom: 2px solid rgb(252,133,10); }
                    .head h1 { display: inline-block; vertical-align: middle; color: #666; }
                    p { padding: 0 10px; line-height: 1.7; }
                    footer { width: 100%; margin-top: 60px; padding: 20px 0; font-weight: 100; text-align: center; background: #fafafa; }
                    img { text-align: center; margin: 5px; }
                    a { color: rgb(255,255,255); text-decoration: none; }
                    a:hover { text-decoration: underline; }
                    .quote { font-size: 14px; padding-left: 10px; border-left: 3px solid #eee; }
                    .img-wrapper { display: inline-block; vertical-align: middle; margin-right: 30px; }
                    img { width: 100px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="head">
                        <div class="img-wrapper">
                            <img src="${business.logo}" alt="${business.name + ' logo'}" title="${business.name}"/>
                        </div>
                        <h1>${title} ${business.name}</h1>
                    </div>

                    ${content}

                    <p>Życzymy wielu udanych transakcji!</p>
                    <p>Z poważaniem:<br/>
                        Zespół ${ business.name }</p>

                    <footer>${footer}</footer>
                </div>
            </body>
        </html>`
    );
};