const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;
require('../models/Admin');
require('../models/User');
require('../models/Auction');
require('../models/Rate');
require('../models/Category');
const Admin = mongoose.model('admin');
const User = mongoose.model('user');
const Auction = mongoose.model('auction');
const Rate = mongoose.model('rate');
const Category = mongoose.model('category');
const Subcategory = mongoose.model('subcategory');
const SubSubCategory = mongoose.model('sub_subcategory');
const Property = mongoose.model('property');
const Mailer = require('../services/Mailer');
const userDeletedTemplate = require('../services/emailTemplates/userDeletedTemplate');
const mailUserTemplate = require('../services/emailTemplates/mailUserTemplate');
const bulkMailTemplate = require('../services/emailTemplates/bulkMailTemplate');
const mailAuctionTemplate = require('../services/emailTemplates/mailAuctionTemplate');
const auctionDeletedTemplate = require('../services/emailTemplates/auctionDeletedTemplate');
const contactEaukcjeTemplate = require('../services/emailTemplates/contactEaukcjeTemplate');
const business = require('../services/emailTemplates/business');
const requireLogin = require('../middleware/requireLogin');

const multer = require('multer');
const upload = multer();

const util = require('util');

const DOCUMENT_DOCTYPES = ['user', 'auction'];

module.exports = app => {
	app.post('/api/contact_eaukcje', [requireLogin, upload.any()], async(req, res) => {
		const
			to 	 = 'pawel.jarema@dd1studio.com',
			from = req.user.contact.email, 
			{ message } = req.body,
			mailer = new Mailer(
				{ subject: 'Pomoc eaukcje.pl', recipients: [{ email: to }] }, 
				contactEaukcjeTemplate(from, message)
			);

			mailer.send();
			req.session.message = 'Wysłano wiadomość. Odpowiemy niebawem';

			res.send(true);
	});

	app.post('/api/post_categories', async (req, res) => {
		const
			tree = req.body,
			_id  = tree.admin_id;

		const admin = await Admin.countDocuments({ _id: ObjectId(_id) });

		if (Number(admin) > 0) {
			await Category.deleteMany({});
	        await Subcategory.deleteMany({});
	        await SubSubCategory.deleteMany({});
	        await Property.deleteMany({});

	        // kategorie
	        const categories = tree.children;
	        if (isNotEmpty(categories)) {
		        for (let c = 0; c < categories.length; c++) {
		            const
		            	categoryItem = categories[c],
		                category = new Category({
		                    name: categoryItem.module,
		                    subcategories: []
		                }),
		                subcategories = categoryItem.children;
		            
		            if (isNotEmpty(subcategories)) {
			            for (let sc = 0; sc < subcategories.length; sc++) {
			                const
			                	subcategoryItem = subcategories[sc],
			                    subcategory = new Subcategory({
			                        name: subcategoryItem.module,
			                    }),
			                    subsubcategories = subcategoryItem.children,
			                    properties = subcategoryItem.properties;

			                if (isNotEmpty(properties)) {
			                    // create subcategory with props
			                    subcategory.properties = [];

			                    for (let p = 0; p < properties.length; p++) {
			                        const prop = new Property(properties[p]);
			                        subcategory.properties.push(prop);
			                    }

			                    subcategory.markModified('properties');
			                } else if (isNotEmpty(subsubcategories)) {
			                    // iterate third level
			                    subcategory.sub_subcategories = [];
			                    for (let ssc = 0; ssc < subsubcategories.length; ssc++) {
			                        const
			                        	subsubcategoryItem = subsubcategories[ssc],
			                            properties      = subsubcategoryItem.properties,
			                            sub_subcategory = new SubSubCategory({
			                                name: subsubcategoryItem.module,
			                                properties: []
			                            });

			                        if (isNotEmpty(properties)) {
			                            for (let p = 0; p < properties.length; p++) {
			                                const prop = new Property(properties[p]);
			                                sub_subcategory.properties.push(prop);
			                            }
			                        }

			                        sub_subcategory.markModified('properties');
			                        await sub_subcategory.save();
			                        subcategory.sub_subcategories.push(sub_subcategory);
			                        subcategory.markModified('sub_subcategories');
			                    }
			                }

			                await subcategory.save();
			                category.subcategories.push(subcategory);
			            }
		      		}

		            await category.save();
		        }
	    	}


			req.session.message = 'Zapisano drzewo kategorii';
			res.send(true);
		} else {
			req.session.error = 'Zaloguj się jako administrator';
			res.send(false);
		}
    });

	app.post('/api/delete_auction', async (req, res) => {
		const { auction_id, email, title, reason, admin_id, doctype, page, per_page } = req.body;

		let auctions;
		const admin = await Admin.findOne({ _id: ObjectId(admin_id) });
		if (!admin) {
			res.send(await paginateAuctions(page, per_page));
		}

		Auction.remove({ _id: ObjectId(auction_id) })
			.then(
				async doc => {
					req.session.message = 'Usunięto aukcję i przesłano wiadomość'; 
					const mailer = new Mailer(
						{ 
							subject: 'Wiadomość administracyjna z portalu ' + business.name, 
							recipients: [{ email }]
						}, 
						auctionDeletedTemplate(title, reason)
					);

					await mailer.send();

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
		User.deleteOne({ _id: ObjectId(user_id) })
			.then(
				async doc => { 
					await Auction.deleteMany({ _user: ObjectId(user_id) });
					
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
				doc => { req.session.message = 'Zapisano wysokość prowizji'; req.session.admin = doc; res.send(doc); },
				err => { console.log(err); req.error.message = 'Nastąpił błąd. Spróbuj później'; res.send(admin); }
			);
	});

	app.get('/api/tech_break', async (req, res) => {
		const admin = await Admin.findOne({}, { techbreak: 1, provision: 1 });		
		if (admin) {
			res.send({ techbreak: admin.techbreak || false, provision: admin.provision });
			return;
		} else {
			res.send({ techbreak: false, provision: 5 });
		}
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
				doc => { res.send(admin); },
				err => { console.log(err); res.send(admin) }
			);

	});
}

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
	
	const 	count = await Auction.countDocuments(),
			pages = Math.ceil(count / +per_page);

	for (let i = 0, l = auctions.length; i < l; i++) {
		const doc = auctions[i];
		const user = await User.findOne({ _id: doc._user }, { firstname: 1, lastname: 1, contact: 1 });
		if (user) {
			doc.owner = `${user.firstname || ''} ${user.lastname || (!user.firstname ? 'Anonim' : '')}`;
			doc.email = user.contact.email;
		} else {
			doc.owner = 'null';
			doc.email = 'null';
		}
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

function isNotEmpty(object) {
  if (Object.prototype.toString.call(object) === '[object Array]') {
    return object.length > 0;
  }

  return Boolean(object);
}
