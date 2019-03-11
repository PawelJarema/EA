require('../models/Chat');

const
	mongoose = require('mongoose'),
	User = mongoose.model('user');


module.exports.enqueueAuctionOwnerToSendItems = enqueueAuctionOwnerToSendItems;
module.exports.filterUnique = filterUnique;

async function enqueueAuctionOwnerToSendItems(auction_owner_id, buyer_id) {
	const
		owner = await User.findOne({ _id: auction_owner_id });

	if (!owner.toSend) {
		owner.toSend = [buyer_id];
	} else {
		owner.toSend.push(buyer_id);
	}

	owner.save()
}

function filterUnique(val, i, arr) {
	return arr.indexOf(val) === i;
}

