const production = process.env.NODE_ENV === 'production';

module.exports = {
    name: 'Eaukcje.pl',
    email: 'noreply@eaukcje.pl',
    host: (production ? 'https://eaukcje.pl/' : 'http://localhost:3000/'),
    logo: 'http://drive.google.com/uc?export=view&id=1m1uMNGwcRDcjL8m2w7z2Rl4hKvzKwzA8'
};