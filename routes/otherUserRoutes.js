const mongoose = require('mongoose');
require('../models/User');
require('../models/Auction');
require('../models/Rate');
const User = mongoose.model('user');
const Auction = mongoose.model('auction');
const Rate = mongoose.model('rate');
const { ObjectId } = mongoose.Types;

module.exports = app => {
	app.get('/other_user/:id', async (req, res) => {
		const id = ObjectId(req.params.id);
		const user = await User.findOne({ _id: id }).lean();
		const auctions = await Auction.find({ _user: id, ended: { $ne: true } }, { title: 1, shortdescription: 1, likes: 1 }).lean();

		user.auctions = auctions;

		if (user.rating && user.rating.auctions) {
			user.auction_count = user.rating.auctions;
		} else {
			const auctions = await Auction.countDocuments({ _user: id });  // this won't work if we delete ended auctions
			user.auction_count = auctions;
		}

		const rates = await Rate.find({ _user: id });	
		if (rates.length) { 
			user.rating = parseInt(rates.map(rate => rate.rate).reduce((a, b) => a + b) / rates.length);
			user.bad_auctions = rates.filter(rate => rate.rate < 3).length;
			user.bad_bids = 0; //TODO
		} else {
			user.rating = null;
			user.bad_auctions = 0;
			user.bad_bids = 0;
		}
		
		const bids = await Auction.countDocuments(
			{ bids: { $elemMatch: { _user: id } }},
		);
		user.bid_count = bids;
		 
		res.send(user);
	});
}