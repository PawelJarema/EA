const proxy = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(proxy('/api/**', { target: 'http://localhost:5000' }));
    app.use(proxy('/auth/**', { target: 'http://localhost:5000' }));
    app.use(proxy('/user/**', { target: 'http://localhost:5000' }));
    app.use(proxy('/auction/**', { target: 'http://localhost:5000' }));
    app.use(proxy('/other_user/**', { target: 'http://localhost:5000' }));
    app.use(proxy('/chats/**', { target: 'http://localhost:5000' }));
    app.use(proxy('/przelewy24/**', { target: 'http://localhost:5000' }));
}