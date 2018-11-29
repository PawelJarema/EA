const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('../models/Admin');
require('../models/User');
require('../models/Auction');
require('../models/Rate');
const Admin = mongoose.model('admin');
const User = mongoose.model('user');
const Auction = mongoose.model('auction');
const Rate = mongoose.model('rate');
const Mailer = require('../services/Mailer');
const userDeletedTemplate = require('../services/emailTemplates/userDeletedTemplate');
const mailUserTemplate = require('../services/emailTemplates/mailUserTemplate');
const bulkMailTemplate = require('../services/emailTemplates/bulkMailTemplate');
const mailAuctionTemplate = require('../services/emailTemplates/mailAuctionTemplate');
const auctionDeletedTemplate = require('../services/emailTemplates/auctionDeletedTemplate');
const business = require('../services/emailTemplates/business');

const multer = require('multer');
const upload = multer();

const DOCUMENT_DOCTYPES = ['user', 'auction'];

async function fetchOpinions(user_id) {
	const opinions = await Rate.find({ _user: ObjectId(user_id) }, { rate: 1 });
	const count = opinions.length;
	const rate = count ? (opinions.map(opinion => opinion.rate).reduce((a, b) => a + b) / count).toFixed(2) : 0;

	return ({ count, rate });
}

async function paginateAuctions(page, per_page) {
	const auctions = await Auction.find(
		{},{},
		{ skip: (+page - 1) * +per_page, limit: +per_page, sort: { joindate: -1 }}
	).lean();
	const pages = Math.ceil(await Auction.countDocuments() / +per_page);
	for (let i = 0, l = auctions.length; i < l; i++) {
		const doc = auctions[i];
		const user = await User.findOne({ _id: doc._user }, { firstname: 1, lastname: 1, contact: 1 });
		doc.owner = `${user.firstname || ''} ${user.lastname || (!user.firstname ? 'Anonim' : '')}`;
		doc.email = user.contact.email;
	}

	return ({ 'auction': auctions, count: pages });
}

async function paginateUsers(page, per_page) {
	const users = await User.find(
		{},{},
		{ skip: (+page - 1) * +per_page, limit: +per_page, sort: { joindate: -1 }}
	).lean();
	const pages = Math.ceil(await User.countDocuments() / +per_page);

	for (let i = 0; i < users.length; i++) {
		const user = users[i];
		user.opinion = await fetchOpinions(user._id);
	}

	return ({ 'user': users, count: pages });
}

module.exports = app => {
	app.post('/api/delete_auction', async (req, res) => {
		const { auction_id, email, title, reason, admin_id, doctype, page, per_page } = req.body;

		let auctions;
		const admin = await Admin.findOne({ _id: ObjectId(admin_id) });
		if (!admin) {
			res.send(await paginateAuctions(page, per_page));
		}

		const auction = await User.findOne({ _id: ObjectId(auction_id) });
		const mailer = new Mailer(
			{ 
				subject: 'Wiadomość administracyjna z portalu ' + business.name, 
				recipients: [{ email }]
			}, 
			auctionDeletedTemplate(title, reason)
		);

		await mailer.send();
		Auction.remove({ _id: ObjectId(auction_id) })
			.then(
				async doc => {
					req.session.message = 'Usunięto aukcję i przesłano wiadomość'; 
					res.send(await paginateAuctions(page, per_page)); 
				},
				async err => { 
					console.log(err); 
					req.session.error = 'Nastąpił błąd. Spróbuj później'; 
					res.send(await paginateAuctions(page, per_page));
				}
			);
    });

	app.post('/api/mail_all_users', upload.any(), async (req, res) => {
		const { admin_id, subject, message } = req.body;
		
		const admin = await Admin.findOne({ _id: ObjectId(admin_id) });
		if (!admin) {
			res.send(false);
		}

		const users = await User.find({ 'agreements.corespondence': true });

		let recipients = [];
		for (let i = 0, l = users.length; i < l; i++) {
			recipients.push({ email: users[i].contact.email });
		}

		const mailer = new Mailer({ subject, recipients }, bulkMailTemplate(subject, message));
		await mailer.send();

		req.session.message = 'Wysłano wiadomość do bazy mailingowej';
		res.send(true);
	});

	app.post('/api/mail_user', upload.any(), async (req, res) => {
		const { admin_id, email, title, subject, message } = req.body;

		const admin = await Admin.findOne({ _id: ObjectId(admin_id) });
		if (!admin || !email || !message) {
			res.send(false);
		}

		let mailer;
		if (title) {
			mailer = new Mailer({ subject: ('E-mail w sprawie przedmiotu ' + title), recipients: [{ email }] }, mailAuctionTemplate(title, subject, message));
		} else {
			mailer = new Mailer({ subject, recipients: [{ email }] }, mailUserTemplate(subject, message));
		}
	
		const response = await mailer.send();
		console.log(response);
		
		req.session.message = 'Wysłano wiadomość';
		res.send(true);
	});

	app.post('/api/delete_user', async (req, res) => {
		const { user_id, reason, admin_id, doctype, page, per_page } = req.body;
		const admin = await Admin.findOne({ _id: ObjectId(admin_id) });
		if (!admin) {
			res.send(await paginateUsers(page, per_page));
		}

		const user = await User.findOne({ _id: ObjectId(user_id) });
		const mailer = new Mailer(
			{ 
				subject: 'Wiadomość administracyjna z portalu ' + business.name, 
				recipients: [{ email: user.contact.email }]
			}, 
			userDeletedTemplate(reason)
		);

		await mailer.send();
		User.remove({ _id: ObjectId(user_id) })
			.then(
				async doc => { 
					await Auction.remove({ _user: ObjectId(user_id) });
					
					req.session.message = 'Usunięto konto użytkownika i przesłano wiadomość'; 
					res.send(await paginateUsers(page, per_page)); 
				},
				async err => { 
					console.log(err); 
					req.session.error = 'Nastąpił błąd. Spróbuj później';
					res.send(await paginateUsers(page, per_page)); }
			);
	});

	app.post('/api/fetch_documents', async (req, res) => {
		const { admin_id, doctype, page, per_page } = req.body;

		const admin = await Admin.findOne({ _id: ObjectId(admin_id) });
		if (!admin) {
			res.send(false);
		}

		switch (doctype) {
			case 'user':
				res.send(await paginateUsers(page, per_page));
				break;
			case 'auction':
				res.send(await paginateAuctions(page, per_page));
				break;
		}
	});

	app.post('/api/provision', async (req, res) => {
		const { admin_id, provision } = req.body;

		const admin = await Admin.findOne({ _id: ObjectId(admin_id) });
		if (!admin) {
			res.send(false);
		}

		admin.provision = parseInt(provision);
		admin
			.save()
			.then(
				doc => { req.session.message = 'Zapisano wysokość prowizji'; res.send(admin); },
				err => { console.log(err); req.error.message = 'Nastąpił błąd. Spróbuj później'; res.send(admin); }
			);
	});

	app.get('/api/tech_break', async (req, res) => {
		const admin = await Admin.findOne({});		
		res.send(admin.techbreak || false);
	});

	app.post('/api/tech_break', async (req, res) => {
		const { admin_id } = req.body;

		const admin = await Admin.findOne({ _id: ObjectId(admin_id) });
		if (!admin) {
			res.send(false);
		}

		admin.techbreak = admin.techbreak ? !admin.techbreak : true;
		admin
			.save()
			.then(
				doc => { res.send(admin.techbreak); },
				err => { console.log(err); res.send(admin.techbreak) }
			);

	});
}