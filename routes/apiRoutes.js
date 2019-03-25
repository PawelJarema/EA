require('../models/User');
require('../models/Auction');

const
	express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'),
	User = mongoose.model('user'),
	Auction = mongoose.model('auction'),
	{ ObjectId } = mongoose.Types,
	bcrypt = require('bcryptjs'),
	saltRounds = 10,
	re = require('../services/helpers/regexHelper'),
	{ savePhotos } = require('./auctionRoutes');

router.post('/',  (req, res) => {
	res.send({ status: 'ok' });
});

router.post('/get_auction_id', async (req, res) => {
	const { title, user_email } = req.body,
		user = await User.findOne({ 'contact.email': user_email }),
		auction = await Auction.findOne({ title, _user: user._id });

	if (auction) {
		res.status(200).send({ _id: auction._id });
	} else {
		res.status(400).send({ error: 'No auction ' + title + ' found for user ' + user_email });
	}
});

// 5c98b4d52701ad063450be7e test
router.post('/post_photos', async (req, res) => {
		const { _id, user_email } = req.body,
			user = await User.findOne({ 'contact.email': user_email }),
			auction = await Auction.findOne({ _id: ObjectId(_id), _user: user._id });

		if (!user) {
			res.status(401).send('User ' + user_email + ' does not exist.');
			return;
		}

		if (!auction) {
			res.status(400).send('No auction with _id: ' + _id + ' for user ' + user.contact.email);
			return;
		}

		const files = req.files;
		console.log(req.body, req.files, files, files.length);

		if (files && files.length) {
			console.log(files);
			savePhotos(auction, files);
			res.status(200).send(true);
		} else {
			res.status(400).send({ error: 'Invalid photo files or no files at all.' });
		}
});

router.post('/post_auction', async (req, res) => {
	// required data
	const
		{ user_email, user_password } = req.body,
		{ title, shortdescription, description, start_price, duration = 12, quantity = 1} = req.body,
		user = await User.findOne({ 'contact.email': user_email });

	if (!user) {
		res.status(401).send({ error: 'User: ' + user_email + ' does not exists' });
		return;
	}

	const auctionExists = await Auction.findOne({ title, _user: user._id });
	if (auctionExists) {
		res.status(401).send({ error: 'Auction titled ' + title + ' already created.', _id: auctionExists._id });
		return;
	}
	// optional data
	const
		{ min_price, buy_now_price, hide_min_price } = req.body;

	// categories
	const
		{ category_main, category_sub, category_subsub } = req.body;

	// deliveries, properties and int_properties
	const
		{ deliveries, properties, int_properties } = req.body;

	if (!deliveries) {
		res.status(400).send({ error: 'deliveries field: auction should have at least one delivery method. [{ name: String, price: Number }]' });
		return;
	}

	if (!(title && shortdescription && start_price && duration)) {
		res.status(400).send({ error: 'Auction should have all of following fields: title, start_price, duration, shortdescription' });
		return;
	}

	if (!(category_main)) {
		res.status(400).send({ error: 'Auction should have at least category_main' });
		return;
	}

	// to remember
	// price.current_price, date.start_date, likes, verified, properties,
	// photos
	const
		auction = new Auction({
				_user: user._id,
				title,
				shortdescription,
				description,
				price: {
					start_price,
					min_price,
					current_price: start_price,
					hide_min_price
				},
				date: {
					start_date: Date.now(),
					duration
				},
				likes: 0,
				quantity,
				photos: [],
				attributes: [],
				categories: {
					main: category_main,
					sub: category_sub,
					subsub: category_subsub
				},
				bids: [],
				verified: true,
				ended: false,
				properties,
				int_properties,
				deliveries
		});

	await auction.save()
		.then(
			doc => res.status(200).send({ _id: doc._id, message: 'Auction created. Post photos for specified id.' }),
			err => res.status(400).send({ error: 'Error creating auction.' })
		);
});

router.post('/post_user', async (req, res) => {
	const
		{ firstname, lastname, birthdate } = req.body,  // is 18 yrs. old
		{ linkedinId, facebookId, googleId, twitterId } = req.body,
		{ corespondence } = req.body,
	// joindate
		{ address_street, address_postal, address_city } = req.body,
		{ user_email, invoice_email, phone } = req.body,
		{ account_number } = req.body,
	// deliveries - post array of name / price
	// https://stackoverflow.com/questions/49700051/sending-http-post-request-to-site-with-array-in-body
		{ deliveries } = req.body,
	// agreements.rodo_1, rodo_2, corespondence  <= auto-send
		{ user_password } = req.body,
		{ firm_name, nip } = req.body;
	// freebies

	if (firstname && lastname && birthdate && address_street && address_postal && address_city) {
		if (birthdate > (Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)) {
			res.status(400).send({ error: 'birthdate field error. User should be at least 18 years old.' });
		} else {
			if (account_number && re.account.test(account_number)) {

				if (!user_email || !re.email.test(user_email)) {
						res.status(400).send({ error: 'user_email field should contain a valid email.' });
						return;
				}

				if (!user_password || !re.password.test(user_password)) {
					res.status(400).send({ error: 'user_password field should contain a password at least 8 characters long.' });
					return;
				}

				const
					address = {
						street: address_street,
						postal: address_postal,
						city: address_city
					},
					contact = {
						email: user_email,
						invoice_email,
						phone
					},
					firm = {
						firm_name,
						nip
					},
					balance = {
						account_number
					}; // array of obj { name: String, price: Number };

				// create password hash
				bcrypt.hash(user_password, saltRounds, async (err, hash) => {
					if (err) {
						res.status(400).send({ error: 'Error hashing user_password.' });
					} else {
						const
							auth = { linkedinId, facebookId, googleId, twitterId },
							security = {
								password: hash,
								verified: true
							},
							user = new User({
								firstname,
								lastname,
								birthdate,
								joindate: Date.now(),
								address,
								auth,
								contact,
								balance,
								deliveries,
								agreements: {
									rodo_1: true,
									rodo_2: true,
									corespondence
								},
								security,
								firm
							});

							if (await userExists(user_email)) {
								res.status(400).send({ error: 'User with user_email of ' + user_email + ' already exists.' });
							} else {
								user.save().then(
									doc => res.status(200).send(true),
									err => res.status(400).send({ error: 'Error persisting user to storage' })
								);
							}
					}
				});
			} else {
				res.status(400).send({ error: 'account_number field error. User should have a valid bank account number.' });
			}
		}
	} else {
		res.status(400).send({ error: 'One or more of fields missing: firstname, lastname, birthdate, address_street, address_postal, address_city.' });
	}
});

router.post('/user_exists', async (req, res) => {
	const { user_email } = req.body;

	if (await userExists(user_email)) {
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

async function userExists(email) {
	return Boolean(await User.countDocuments({ 'contact.email': email }));
}
