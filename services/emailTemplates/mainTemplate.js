const business = require('./business');

const logo_src = 'https://drive.google.com/open?id=1ZOO7qqZqRh4DjYFJQYVoVOQqfVVFd6Fr';
const footer = `Copyright © 2018 <a href="${business.host}">E-Aukcje.pl.</a> Wszelkie prawa zastrzeżone.`;

module.exports = (title, content) => {
	return (
        `<html>
            <head>
                <style>
                    .container { width: 500px; margin: auto; padding: 20px; }
                    .head { color: white; background: rgb(252,133,10); margin-bottom: 40px; padding: 20px 10px; text-align: center; } 
                    p { padding: 0 10px; line-height: 1.7; }
                    footer { width: 100%; margin-top: 40px; padding: 20px 0; font-weight: 100; text-align: center; border-bottom: 2px solid rgb(252,133,10); border-top: 1px solid rgb(252,133,10);}
                    img { text-align: center; margin: 5px; }
                    a { color: rgb(255,255,255); text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="head">
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