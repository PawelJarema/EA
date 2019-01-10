require('../models/Auction');

const 
	requireLogin 	= require ('../middleware/requireLogin'),
	xml 			= require('xmlbuilder'),
	xml2js			= require('xml2js'),
	md5				= require('md5'),
	upload			= require('multer')(),
	mongoose 		= require('mongoose'),
	{ ObjectId }	= mongoose.Types,
	Auction 		= mongoose.model('auction');

module.exports = app => {
	app.post('/import_export/export', requireLogin, async (req, res) => {
		const { id } = req.body;

		const auction = await Auction.findOne({ _id: ObjectId(id) });
		const code = md5([auction.title, auction.date.start_date, auction.price.start_price].join('|'));	

		let doc = xml.create('auction');
		doc.ele('title', auction.title);
		doc.ele('short_description', auction.shortdescription);
		doc.ele('description', auction.description);
		doc.ele('quantity', auction.quantity);
		doc.ele('likes', auction.likes);
		doc.ele('verification_code', code);
		
		let price = doc.ele('price', { 'unit': 'PLN' });
		if (auction.price.start_price) price.ele('start_price', auction.price.start_price);
		if (auction.price.min_price) price.ele('min_price', auction.price.min_price);
		if (auction.price.buy_now_price) price.ele('buy_now_price', auction.price.buy_now_price);
		price.ele('hide_min_price', Boolean(auction.price.hide_min_price));
		
		let date = doc.ele('date');
		date.ele('start_date', { 'unit': 'millis' }, auction.date.start_date);
		date.ele('duration', { 'unit': 'days' }, auction.date.duration);

		let categories = doc.ele('categories');
		categories.ele('main', auction.categories.main);
		categories.ele('sub', auction.categories.sub);

		let attributes = doc.ele('attributes');
		for (let i = 0; i < auction.attributes.length; i++) {
			const attribute = auction.attributes[i];
			attributes.ele('attribute', { 'name': attribute.name }, attribute.value);
		}

		let photos = doc.ele('photos', { 'encoding': 'base64' });
		for (let i = 0; i < auction.photos.length; i++) {
			const photo = auction.photos[i];
			photos.ele('photo', { 'type': (photo.type || 'image/jpg') }, photo.data);
		}

		doc.end({ pretty: true });

		res.send(doc.toString());
	});

	app.post('/import_export/import', [requireLogin, upload.any()], async (req, res) => {
		if (req.files && req.files[0]) {
			const file = req.files[0];

			if (file.mimetype.indexOf('xml') === -1) {
				req.session.error = 'Niewłaściwy format pliku. Prześlij plik w formacie XML';
				res.send(false);
				return;
			}

			xml2js.parseString(
				file.buffer.toString('utf8'), 
				async (err, result) => {
					if (err) {
						console.log(err);
						req.session.error = 'Zdeformowany plik XML';
						res.send(false);
						return;
					}

					try {
						const 	data 		= result.auction,
								price 		= data.price[0],
								date 		= data.date[0],
								categories	= data.categories[0],
								attributes	= data.attributes[0],
								photos		= data.photos[0];

						const 	user 		= req.user,
								auction 	= new Auction({
									_user: user._id,
									title: data.title[0],
									shortdescription: data.short_description[0] || '',
									description: data.description[0] || '',
									quantity: data.quantity[0] || 1,
									likes: data.likes[0] || 0,
									price: {
										start_price: price.start_price[0],
										min_price: price.min_price[0],
										buy_now_price: price.buy_now_price[0],
										hide_min_price: price.hide_min_price[0] === 'true'
									},
									date: {
										start_date: new Date().getTime(),
										duration: +date.duration[0]._
									},
									categories: {
										main: categories.main[0],
										sub: categories.sub[0]
									},
									attributes: [],
									photos: []
								});

						const code = md5([auction.title, date.start_date[0]._, auction.price.start_price].join('|'));
						if (code !== data.verification_code[0]) {
							req.session.error = 'Próba importu spreparowanego pliku';
							res.send(false);
							return;
						}

						for (let i = 0; i < attributes.attribute.length; i ++) {
							const attribute = attributes.attribute[i];
							auction.attributes.push({ name: attribute.$.name, value: attribute._ })
						}

						for (let i = 0; i < photos.photo.length; i ++) {
							const photo = photos.photo[i];
							auction.photos.push({ type: photo.$.type, data: photo._ })
						}

						await auction
							.save()
							.then(
								doc => {
									req.session.message = 'Zaimportowano aukcję';
									res.send(true);
									return;
								},
								err => {
									console.log(err);
									req.session.error = 'Import nie powiódł się. Spróbuj ponownie';
									res.send(false);
									return;
								} 
							);
					} catch(err) {
						console.log(err);
						req.session.error = 'Plik XML nie zawiera potrzebnych danych';
						res.send(false);
						return;
					}
			});
		} else {
			req.session.error = 'Błąd pliku. Spróbuj ponownie';
			res.send(false);
			return;
		}
	});
}