const
	md5 = require('md5'),
	{ appAuthSecret } = require('../config/keys');


module.exports = (req, res, next) => {
	if (!verifyRequest(req.body)) {
		res.status(401).send({ error: 'Bad token' });
	} else if (!verifyTimeout(req.body.date_milliseconds, 5)) {
		res.status(400).send({ error: 'Token expired' });
	} else {
		next();
	}
}

function verifyRequest(body) {
	let { date_milliseconds, user_email, user_password, token } = body;

	return token === md5(`${ date_milliseconds }|${ appAuthSecret }|${ user_email }|${ user_password }`);
}

function verifyTimeout(request_time_milliseconds, timeout_minutes) {
	return (Date.now() - (timeout_minutes * 60 * 1000)) <= parseInt(request_time_milliseconds);
}
