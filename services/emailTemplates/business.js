const production = process.env.NODE_ENV === 'production';

module.exports = {
    name: 'E-Aukcje.pl',
    email: 'noreply@eaukcje.pl',
    host: (production ? 'http://46.101.229.199:5000/' : 'http://localhost:3000/')
};