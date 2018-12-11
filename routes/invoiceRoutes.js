require('../models/User');

const 	multer			= require('multer'),
		upload			= multer(),
		mongoose		= require('mongoose'),
		{ ObjectId }	= mongoose.Types,
		User			= mongoose.model('user'),
		Transaction		= mongoose.model('transaction'),
		requireLogin	= require('../middleware/requireLogin'),
		business		= require('../services/emailTemplates/business'),
		Mailer			= require('../services/Mailer'),
		invoiceTemplate	= require('../services/emailTemplates/invoiceTemplate');

module.exports = app => {
	app.post('/invoices/send', requireLogin, async (req, res) => {
		const 
			{ id, vat }			= req.body,
			transaction 		= await Transaction.findOne({ _id: ObjectId(id) }),
			seller 				= req.user,
			buyer 				= await User.findOne({ _id: ObjectId(transaction._buyer) }),
			subject				= `Faktura ${business.name} za ${transaction.title}`,
			recipients			= [{ email: buyer.contact.invoice_email || buyer.contact.email }, { email: seller.contact.invoice_email || seller.contact.email }],
			mailer 				= new Mailer({ subject, recipients }, invoiceTemplate(seller, buyer, transaction, vat));

			await mailer.send();
			req.session.message = 'Wysłano fakturę. Kopia została przesłana również do Ciebie';

			transaction.sent = true;
			transaction.vat = Boolean(vat);
			await transaction.save();

			res.send(true);
	});

	app.post('/invoices/fetch_invoices', requireLogin, async (req, res) => {
		const 
			seller 				= req.user,
			{ page, per_page } 	= req.body,
			query 				= { _seller: ObjectId(seller._id) },
			projection 			= {},
			options 			= { sort: { date: -1 }, limit: +per_page, skip: ((+page - 1) * +per_page) },
			transactions 		= await Transaction.find(query, projection, options).lean();

		for (let i = 0; i < transactions.length; i++) {
			const 	
				transaction 	= transactions[i],
				buyer 			= await User.findOne({ _id: ObjectId(transaction._buyer) });
			
			transaction.buyer 	= buyer;
		}

		const count = await Transaction.countDocuments(query);
		transactions.push(Math.ceil(count / +per_page));

		res.send(transactions);
	});
}