const axios 			= require('axios');
const requireLogin 		= require('../middleware/requireLogin');
const qs 				= require('qs');
const md5 				= require('md5');
const keys 				= require('../config/keys');
const business 			= require('../services/emailTemplates/business');
const P24 				= require('../services/Przelewy24')();

const mongoose 			= require('mongoose');
const { ObjectId } 		= mongoose.Types;

require('../models/User');
require('../models/Admin');
require('../models/Auction');
require('../models/CreditTransaction');

const User 				= mongoose.model('user');
const Admin 			= mongoose.model('admin');
const Auction 			= mongoose.model('auction');
const Transaction 		= mongoose.model('transaction');
const CreditTransaction	= mongoose.model('creditTransaction');

const Mailer 			= require('../services/Mailer');
const sendItemTemplate	= require('../services/emailTemplates/sendItemTemplate');
const paySimpleTemplate	= require('../services/emailTemplates/paySimpleTemplate');

// 	verify: 'https://sandbox.przelewy24.pl/trnVerify'

function TransactionId(title, price, buyer, owner_id) {
	return md5([ title, price, buyer._id, owner_id ].join('|'));
}

module.exports = app => {
	app.post('/przelewy24/ping', requireLogin, async (req, res) => {
		P24.testSoapAccess();
		P24.testRestAccess();

		res.send(true);
	});

	app.post('/przelewy24/buyCredits', requireLogin, async (req, res) => {
		const buyer = req.user;
		const { qty, cost } = req.body;

		const title = 'Kupno kredytów eaukcje.pl w liczbie ' + qty;
		const transaction_id = TransactionId('buy credits', +qty * +cost, buyer, new Date().getTime());

		let data = {
			p24_merchant_id: keys.przelewy24Id,
			p24_pos_id: keys.przelewy24Id,
			p24_session_id: transaction_id,
			p24_amount: (+qty * +cost) * 100, 
			p24_currency: 'PLN',
			p24_description: title,
			p24_email: buyer.contact.email,
			p24_client: `${buyer.firstname || ''} ${buyer.lastname || buyer.firstname ? '' : 'Anonim'}`,
			p24_address: buyer.address ? buyer.address.street : '',
			p24_zip: buyer.address ? buyer.address.postal : '',
			p24_city: buyer.address ? buyer.address.city : '',
			p24_country: 'PL',
			p24_phone: buyer.contact.phone ? buyer.contact.phone : '',
			p24_url_return: business.host + 'przelewy24/creditCallback',
			p24_url_status: business.host + 'przelewy24/creditStatus',
			p24_wait_for_result: 0,
			p24_time_limit: 0,
			p24_channel: 16,
			p24_transfer_label: 'Kupno kredytów eaukcje.pl',
			p24_api_version: '3.2',
			p24_regulation_accept: true
		};

		const token = await P24.registerTransaction(data);

		const transaction = new CreditTransaction({
			date: new Date().getTime(),
			_user: ObjectId(req.user._id),
			p24_session_id: transaction_id,
			token,
			qty,
			done: false
		});
		await transaction.save();

		req.session.message = 'Za chwilę zostaniesz przekierowany na stronę Przelewy24. Proszę czekać...';
		res.send(P24.requestTransactionUrl(token));
	});

	app.get('/przelewy24/creditCallback', async (req, res) => {
		res.redirect('/konto/aukcje/dodaj');
	});

	app.post('/przelewy24/creditStatus', async (req, res) => {
		console.log('creditStatus', req.body);
		
		const { p24_session_id } = req.body;
		const transaction = await CreditTransaction.findOne({ p24_session_id });

		const user = await User.findOne({ _id: ObjectId(transaction._user) });
		const { credits } = user.balance;
		const { qty } = transaction;

		user.balance.credits = credits ? +credits + +qty : +qty;
		transaction.done = true;

		await user.save();
		await transaction.save();
		if (req.session) req.session.message = "Zakup kredytów przebiegł pomyślnie";


		if (P24.verifyTransaction(req.body)) {
			console.log('pomyślnie zweryfikowano zakup kredytów');
		} else {
			console.log('zakup kredytów niezweryfikowany');
		}

		res.send(true);
	});


	/* 

	date: Number,
    token: String,
    transaction_id: String,
    _buyer: ObjectId,
    _seller: ObjectId,
    _auction: ObjectId,
    title: String,
    price: Number,
    delivery_price: Number,
    delivery_method: String,
    confirmed: Boolean 

    */
	app.post('/przelewy24/registerTransaction', requireLogin, async (req, res) => {
		const { paySimple, title, price, shipping_price, shipping_method, qty, owner_id, auction_id } = req.body;
		const buyer = req.user;

		// no P24 Passage account
		if (paySimple) {
			const auction = await Auction.findOne({ _id: ObjectId(auction_id) });
			const owner = await User.findOne({ _id: ObjectId(owner_id) });

			const buynowpayee = auction.buynowpayees && auction.buynowpayees.indexOf(buyer._id) !== -1;
			const payee = auction.payees && auction.payees.indexOf(buyer._id !== -1);

			if (buynowpayee) {
				auction.buynowpayees = auction.buynowpayees.filter(id => String(id) !== String(buyer._id));
			}

			if (payee) {
				auction.payees = auction.payees.filter(id => String(id) !== String(buyer.id));
				if (auction.payees.length === 0) {
					auction.paid = true;
				}
			}

			if (auction.raters) {
				auction.raters.push(ObjectId(buyer._id));
			} else {
				auction.raters = [ObjectId(buyer._id)];
			}

			await auction.save();

			const transaction = new Transaction({
				date: new Date().getTime(),
				_buyer: ObjectId(buyer._id),
				_seller: ObjectId(owner._id),
				_auction: ObjectId(auction._id),
				title,
				price,
				qty,
				delivery_price: shipping_price,
				delivery_method: shipping_method,
				confirmed: true
			});
			await transaction.save();

			const name = `${buyer.firstname || ''} ${buyer.lastname || (buyer.firstname ? '' : 'Anonim')}`;
			const mailer = new Mailer(
				{ subject: 'Kupujący oznaczył aukcję jako opłaconą', recipients: [{ email: owner.contact.email }] },
				paySimpleTemplate(name, buyer.contact.phone, buyer.contact.email, buyer.address, title, (+price + +shipping_price), shipping_method, auction_id)
			);
			await mailer.send();

			req.session.message = 'Sprzedawca został powiadomiony o wpłacie i poproszony o sprawdzenie stanu konta';
			res.send(true);
			return;
		}

		const transaction_id = TransactionId(title, price, buyer, owner_id);

		let data = {
			p24_merchant_id: keys.przelewy24Id,
			p24_pos_id: keys.przelewy24Id,
			p24_session_id: transaction_id,
			p24_amount: (parseInt(price) + parseInt(shipping_price)) * 100, 
			p24_currency: 'PLN',
			p24_description: title,
			p24_email: buyer.contact.email,
			p24_client: `${buyer.firstname || ''} ${buyer.lastname || buyer.firstname ? '' : 'Anonim'}`,
			p24_address: buyer.address ? buyer.address.street : '',
			p24_zip: buyer.address ? buyer.address.postal : '',
			p24_city: buyer.address ? buyer.address.city : '',
			p24_country: 'PL',
			p24_phone: buyer.contact.phone ? buyer.contact.phone : '',
			p24_url_return: business.host + 'przelewy24/callback',
			p24_url_status: business.host + 'przelewy24/status',
			p24_wait_for_result: 1,
			p24_time_limit: 0,
			p24_channel: 16,
			p24_transfer_label: title,
			p24_api_version: '3.2',
			p24_regulation_accept: true
		};
	
		const 
			token 				= await P24.registerTransaction(data),
			transaction_data 	= {
				date: new Date().getTime(),
			    token,
			    transaction_id,
			    _buyer: ObjectId(buyer._id),
			    _seller: ObjectId(owner_id),
			    _auction: ObjectId(auction_id),
			    title,
			    price: parseInt(price),
			    delivery_price: parseInt(shipping_price),
			    delivery_method: shipping_method
			},
			transaction 		= await Transaction.findOneAndUpdate(
				{ transaction_id },
				transaction_data,
				{ upsert: true }
			);

		req.session.message = 'Za chwilę zostaniesz przekierowany na stronę Przelewy24. Proszę czekać...';
		//res.send(P24.requestTransactionUrl(token));

		// try to dispatchTransaction via passage SOAP
		const seller = await User.findOne({ _id: ObjectId(owner_id) });
		const provision = (await Admin.findOne({})).provision;

		const batch = {
			title,
			price,
			provision,
			buyer,
			seller
		};

		const resp = await P24.dispatchTransaction(batch);
		console.log(resp);
	});

	app.post('/przelewy24/status', async (req, res) => {
		console.log('P24 status + verification');
		const { p24_merchant_id, p24_pos_id, p24_session_id, p24_amount, p24_currency, p24_order_id, p24_method, p24_statement, p24_sign } = req.body;

		let data = {
			p24_merchant_id, 
			p24_pos_id, 
			p24_session_id, 
			p24_amount, 
			p24_currency, 
			p24_order_id, 
			p24_sign 
		};

		const confirm = await P24.verifyTransaction(data);

		if (confirm) {
			const transaction = await Transaction.findOne({ transaction_id: p24_session_id });
			transaction.confirmed = true;
			await transaction.save();
			res.send(true);
		} else {
			res.send(false);
		}
	});

	app.get('/przelewy24/callback', async (req, res) => {
		const buyer = req.user;
		const transaction = await Transaction.findOne(
			{ _buyer: ObjectId(buyer._id) },
			{},
			{ sort: { date: -1 } }
		);

		const name = `${buyer.firstname || ''} ${buyer.lastname || (buyer.firstname ? '' : 'Anonim')}`;
		const { address } = buyer;
		const { phone, email } = buyer.contact;
		const { title, price, delivery_method } = transaction;

		const 
			seller = await User.findOne({ _id: transaction._seller }),
			subject = 'Dokonano wpłaty za ' + title + '. Wyślij przedmiot',
			recipients = [{ email: seller.contact.email }],
			confirmed = transaction.confirmed;

		const mailer = new Mailer({ subject, recipients }, sendItemTemplate(name, phone, email, address, title, price, delivery_method, transaction._auction));
		await mailer.send();

		const auction = await Auction.findOne(
			{ _id: ObjectId(transaction._auction) }
		);

		// TODO add rater

		if (confirmed) {
			req.session.message = "Płatność została przesłana";
		} else {
			req.session.message = "Płatność została przesłana i czeka na weryfikację";
		}

		console.log('transaction status: ' + (confirmed ? 'confirmed' : 'not confirmed'));
		res.redirect('/');
	});
}