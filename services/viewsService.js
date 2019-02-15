require('../models/Views');

const
	mongoose 	 = require('mongoose'),
	Views 	 	 = mongoose.model('views'),
	{ ObjectId } = mongoose.Types,
	uuid 		 = require('uuid/v4');

const viewers = {};

function sessionUid(req) {
	if (req.user) {
		return String(req.user._id);
	} else {
		if (req.session.uid) {
			return req.session.uid;
		} else {
			req.session.uid = uuid();
			return req.session.uid;
		}
	}
}

function getViewers(auction_id) {
	if (viewers[auction_id]) {
		return viewers[auction_id].length;
	} else {
		return 0;
	}
}

function addViewer(auction_id, uid) {
	const entry = viewers[auction_id];
	if (entry) {
		if (entry.indexOf(uid) === -1) entry.push(uid);
	} else {
		viewers[auction_id] = [uid];
	}
}

function removeViewer(auction_id, uid) {
	const 
		entry = viewers[auction_id],
		index = entry ? entry.indexOf(uid) : -1;

	if (index !== -1) viewers[auction_id].splice(index, 1);
}

module.exports = app => {
	app.get('/api/views/:auction_id', async (req, res) => {
		const { auction_id } = req.params;

		res.send({ viewers: getViewers(auction_id) });
	});

	app.post('/api/register_viewer/:auction_id', async (req, res) => {
		const 
			{ auction_id } 	= req.params,
			uid 			= sessionUid(req);

		addViewer(auction_id, uid);
		res.send({ viewers: getViewers(auction_id) });
	});

	app.post('/api/unregister_viewer/:auction_id', async (req, res) => {
		const
			{ auction_id }	= req.params,
			uid 			= sessionUid(req);

		removeViewer(auction_id, uid);
		res.send({ viewers: getViewers(auction_id) });
	});

	app.get('/api/get_total_views/:auction_id', async(req, res) => {
		const views = ((await Views.findOne({ _auction: ObjectId(req.params.auction_id) }, { views: 1}).lean()) || {}).views;
		res.send({ views: (views || 0) });
	});

	app.post('/api/add_view_for/:auction_id', async (req, res) => {
		const 
			{ auction_id } 	= req.params,
			_id			   	= ObjectId(auction_id),
			doc 			= await Views.findOne({ _auction: _id }).lean(),
			views 			= doc ? doc.views : 0;

		if (views) {
			await Views.updateOne({ _auction: _id }, { $set: { views: +views + 1 } });
		} else {
			new Views({
				_auction: _id,
				views: 1
			}).save();
		}

		res.send(true);
	});
}