const
	md5 = require('md5'),
	{ appAuthSecret } = require('../config/keys');


module.exports = (req, res, next) => {
	const
		date = Date.now(),
		{ date_milliseconds, user_email, user_password, token } = req.body,
		verifyToken = md5(`${ date_milliseconds }|${ appAuthSecret }|${ user_email }|${ user_password }`);
		

	if (token !== verifyToken) {
		res.status(401).send({ error: 'Bad token' });
	} else if ((date - (5 * 60 * 1000)) > parseInt(date_milliseconds)) {
		res.status(400).send({ error: 'Token expired' });
	} else {
		next();
	}

}