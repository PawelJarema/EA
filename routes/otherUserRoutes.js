const mongoose = require('mongoose');
require('../models/User');
require('../models/Auction');
const User = mongoose.model('user');
const Auction = mongoose.model('auction');
const { ObjectId } = mongoose.Types;

module.exports = app => {
	app.get('/other_user/:id', async (req, res) => {
		const id = ObjectId(req.params.id);
		const user = await User.findOne({ _id: id }).lean();
		const auctions = await Auction.find({ _user: id }, { title: 1, shortdescription: 1, likes: 1 }).lean();

		user.auctions = auctions;

		res.send(user);
	});
}