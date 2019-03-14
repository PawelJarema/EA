require ('../models/User');
require ('../models/Auction');

const 
	mongoose = require('mongoose'),
	{ ObjectId } = mongoose.Types,
	User = mongoose.model('user'),
	Auction = mongoose.model('auction'),
	{ userNameHelper, userFirmHelper, userAddressHelper, userContactHelper } = require('../services/helpers/otherHelpers');

module.exports.removeUserFromRateArray = removeUserFromRateArray;
module.exports.moveUserFromSendToRate = moveUserFromSendToRate;
module.exports.getItemsToRate = getItemsToRate;
module.exports.getItemsToSend = getItemsToSend;
module.exports.makeRow = makeRow;
module.exports.clearUserCache = () => { if (global_user_cache) global_user_cache = {} };

let 
	auction_projection = { _id: 1, title: 1, auctionpaid: 1, buynowpaid: 1, bids: 1 },
	global_user_cache = {};

async function removeUserFromRateArray(owner, _auction, _user, buynow) {
	const index = indexOfSendRateObject(owner.toRate, _auction, _user, buynow);

	if (index !== -1) {
		owner.toRate = owner.toRate.filter(obj => !(String(obj._auction) === String(_auction) && String(obj._user) === String(_user) && obj.buynow === buynow));
		owner.save();
	}

	const auction = await Auction.findOne({ _id: ObjectId(_auction) });
	
	if (buynow) {
		auction.buynowpaid = auction.buynowpaid.filter(id => String(id) !== String(_user));
	} else {
		auction.auctionpaid = auction.auctionpaid.filter(id => String(id) !== String(_user));
	}

	auction.save();
}

async function moveUserFromSendToRate(owner, _auction, _user, buynow) {
	const index = await indexOfSendRateObject(owner.toSend, _auction, _user, buynow);

	if (index !== -1) {
		const item = owner.toSend[index];
		owner.toSend = owner.toSend.filter(obj => !(String(obj._auction) === String(_auction) && String(obj._user) === String(_user) && obj.buynow === buynow));
		if (owner.toRate) {
			owner.toRate.push(item);
		} else {
			owner.toRate = [item];
		}

		owner.save();
	}
}

async function getItemsToSend(owner, buynow) {
	return await getAuctionsToSendRate(owner.toSend, buynow);
}

async function getItemsToRate(owner, buynow) {
	return await getAuctionsToSendRate(owner.toRate, buynow);
}

function indexOfSendRateObject(store, _auction, _user, buynow, count) {
	for (let i = 0; i < store.length; i++) {
		const storeItem = store[i];
		if (String(storeItem._auction) === String(_auction) && String(storeItem._user) === String(_user) && storeItem.buynow === buynow) {
			return i;
		}
	}

	return -1;
}

// data row for marking as sent / rating buyers
async function makeRow(user_id, auction, buynow, toSend, toRate) {
    const user = global_user_cache[user_id] ? global_user_cache[user_id] : global_user_cache[user_id] = await User.findOne({ _id: user_id });

    return ({
        count: (buynow ? auction.buynowpaid.filter(id => String(id) === String(user._id)).length : 1),
        auction: {
            _id: auction._id,
            title: auction.title
        },
        user: {
            _id: user._id,
            name: userNameHelper(user),
            firm: userFirmHelper(user),
            address: userAddressHelper(user),
            contact: userContactHelper(user)
        },
        buynow: buynow,
        toSend,
        toRate
    });
}

async function getAuctionsToSendRate(store, buynow) {
	const ids = 
		store
		.filter(obj => obj.buynow === buynow)
		.map(obj => obj._auction);

	return await Auction.find({ _id: { $in: ids }}, auction_projection);
}