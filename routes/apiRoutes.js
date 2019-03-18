require('../models/User');
require('../models/Auction');

const
	express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('user'),
	Auction = mongoose.model('auction'),
	{ ObjectId } = mongoose.Types;

router.post('/',  (req, res) => {
	res.send({ status: 'ok' });
});

router.post('/post_auction', async (req, res) => {
	// required data
	const 
		{ user_email, user_password } = req.body,
		{ title, shortdescription, description, start_price, duration, quantity } = req.body;

	// optional data
	const 
		{ min_price, buy_now_price, hide_min_price } = req.body;

	// categories
	const
		{ main, sub, subsub } = req.body;

	// deliveries, properties and int_properties


	// to remember 
	// price.current_price, date.start_date, likes, verified, properties,
	// photos
	const { photos } = req.body;
});


router.post('/user_exists', async (req, res) => {
	const { user_email } = req.body;

	if (await User.countDocuments({ 'contact.email': user_email })) {
		res.send(true);
	} else {
		res.send(false);
	}
});

router.post('/user', async (req, res) => {
	const 
		{ user_email } = req.body,
		user = await User.findOne({ 'contact.email': user_email });

	if (user) {
		res.send(user);
	} else {
		res.send(false);
	}
});

module.exports = router;
