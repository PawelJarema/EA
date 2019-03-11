const schedule = require('node-schedule');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

require('../models/User');
require('../models/Auction');
require('../models/Chat');
const User = mongoose.model('user');
const Auction = mongoose.model('auction');
const Chat = mongoose.model('chat');

const dayInMillis = 1000 * 60 * 60 * 24;

let lastAuctionListed = 0;	// last auction listed as pending for verdict
let auctionsPendingVerdict = [];

const Mailer = require('./Mailer');
const business = require('./emailTemplates/business');
const wonTemplate = require('./emailTemplates/wonTemplate');
const lostTemplate = require('./emailTemplates/lostTemplate');
const itemSoldTemplate = require('./emailTemplates/itemSoldTemplate');
const itemNotSoldTemplate = require('./emailTemplates/itemNotSoldTemplate');
const prepayTemplate = require('./emailTemplates/prepayTemplate');
const rateTemplate = require('./emailTemplates/rateTemplate');
const pendingMessagesTemplate = require('./emailTemplates/pendingMessagesTemplate');

const helpers = require('./helpers/otherHelpers');

const notifyAboutPendingChatMessages = async () => {
	const recentlyUpdatedChats = await Chat.find({ messages: { $elemMatch: { seen: { $ne: true }}}});
	let user_ids = new Set();

	for (let i = 0; i < recentlyUpdatedChats.length; i++) {
		const messages = recentlyUpdatedChats[i].messages;
		for (let m = 0; i < messages.length; m++) {
			const message = messages[m];
			if (message) {
				if (message.seen !== true) {
					user_ids.add(message._to);
				}
			} else {
				break;
			}
		} 
	}

	const object_ids = [...user_ids].map(id => ObjectId(id));
	const users = await User.find({ _id: { $in: object_ids }}, { contact: 1 }).lean();

	const emails = users.map(user => ({ email: user.contact.email }));

	if (emails.length) {
		const subject = "Nowe wiadomości na portalu " + business.name;
		const recipients = emails;
		const mailer = new Mailer({ subject, recipients }, pendingMessagesTemplate());
		const response = await mailer.send();
	}
}


const notifyOwnerAboutAuctionEnd = (auction, owner, names) => {
	const subject = `Sprzedałeś przedmiot ${auction.title}`;
	const recipients = [{ email: owner.contact.email }];
	const ownerMailer = new Mailer(
		{ subject, recipients }, 
		itemSoldTemplate(
			auction._id,
			auction.title, 
			names, 
			auction.price.min_price
		)
	);

	ownerMailer.send();
}

const endAuction = async (auction_id) => {
	const auction = await Auction.findOne({ _id: ObjectId(auction_id) });
	const owner = await User.findOne({ _id: auction._user });
	const bids = auction.bids.sort((bid_1, bid_2) => {
		if (bid_1.price < bid_2.price) return 1;
		if (bid_1.price > bid_2.price) return -1;
		return 0;
	});

	auction.ended = true;

	let winning_bid,
		winningUser;

		const min_price = auction.price.min_price || 0;
		let { quantity } = auction,
			winner_ids = [],
			loser_ids = [];

		auction.bids.map(bid => {
			const id = ObjectId(bid._user);
			if (quantity > 0 && bid.price >= min_price) {
				winner_ids.push(id);
				quantity -= 1;
			} else {
				loser_ids.push(id);
			}
		});

		const getUsersByIdArray = async id_array => await User.find({ _id: { $in: id_array }}, { firstname: 1, lastname: 1, contact: 1 });
		const winners = await getUsersByIdArray(winner_ids);
		const losers = await getUsersByIdArray(loser_ids);

		const subject = `Zakończyła się licytacja przedmiotu: "${ auction.title }"`;

		if (winners.length) {
			const subject = `Wygrałeś licytację przedmiotu: ${ auction.title }`;
			const names = winners.map(winner => `${winner.firstname || ''} ${winner.lastname || (!winner.firstname && 'Anonim') }`);
			const emails = winners.map(winner => winner.contact.email);

			for (let i = 0; i < emails.length; i++) {
				const recipients = [{ email: emails[i] }];
				const winMailer = new Mailer({ subject, recipients }, wonTemplate(
					auction._id, 
					auction.title, 
					i === 0 ? auction.price.current_price : auction.bids[i].price
				));
				
				winMailer.send();

				console.log('winner notification sent to ' + emails[i]);

				helpers.sendChatMessagesOnAuctionEnd(winners[i]._id, owner._id, auction, auction.bids[i].price);
			}

			await notifyOwnerAboutAuctionEnd(auction, owner, names);
		} else {
			const subject = `Nie udało się sprzedać przedmiotu ${auction.title}`;
			const recipients = [{ email: owner.contact.email }];

			const ownerMailer = new Mailer(
				{ subject, recipients }, 
				itemNotSoldTemplate(auction._id, auction.title)
			);
			ownerMailer.send();
		}

		if (losers.length) {
			const subject = `Nie udało się wylicytować przedmiotu ${auction.title}`;
			const recipients = losers.map(loser => ({ email: loser.contact.email }))
			const bulkLoseMailer = new Mailer({ subject, recipients }, lostTemplate(auction.title));
			bulkLoseMailer.send();
			console.log('loser notification sent to ' + recipients);
		}

	auction.quantity = quantity;
	auction.payees = winner_ids;

	await auction
		.save()
		.then(
			doc => { 
				const index = auctionsPendingVerdict.indexOf(String(auction._id));
				auctionsPendingVerdict.splice(index, 1);

				console.log(`auction ${doc.title} ${String(doc._id)} ended sucessfully`); 
			}, 
			err => console.log('error on auction-end update ' + err)
		);
};

const disablePremiums = async () => {
	let 
		date = Date.now(),
		auctions = await Auction.find({ ended: { $ne: true }, 'premium.isPremium': true, 'premium.forever': false });

	if (auctions) {
		for (let i = 0; i < auctions.length; i++) {
			const 
				auction = auctions[i],
				endDate = new Date(auction.premium.endDate).getTime();

			if (endDate <= date) {
				auction.premium.isPremium = false;
				await auction.save();
				console.log('End of premium for ' + auction.title);
			} else {
				console.log(auction.title + ' still has some premium time to go.');
			}
		}
	}
}

const schedulePendingAuctions = async () => {
	let auctions = await Auction.find({ ended: { $ne: true }, 'date.start_date': { $gt: lastAuctionListed }}, { _id: 1, date: 1 }, { sort: { 'date.start_date': -1 } });
	const count = auctions.length;
	console.log('auctions #', count);

	if (count === 0) {
		console.log('no new auctions, last listed:', lastAuctionListed);
		return;
	}

	lastAuctionListed = auctions[0].date.start_date;
	console.log('last auction (newest):', lastAuctionListed);

	for (let i = 0, l = auctions.length; i < l; i++) {
		const auction = auctions[i];

		const endDate = new Date(
			auction.date.start_date + 
			(dayInMillis * auction.date.duration)
		);

		schedule.scheduleJob(
			endDate, 
			() => endAuction(auction._id)
		);

		auctionsPendingVerdict.push(
			String(auction._id)
		);

		console.log(`${i+1}/${count} auction ${auction._id} is now pending verdict. \nstart_date: ${auction.date.start_date}\nending: ${endDate}`);
	}
}

const remindToPrepayEndedAuctions = async () => {
	const auctions = await Auction.find (
		{ ended: true, prepaid: { $ne: true } },
		{ _id: 1, payees: 1, title: 1 }
	).lean();

	const count = auctions.length;

	for (let i = 0; i < count; i++) {
		const auction = auctions[i];
		if (!auction.payees || auction.payees.length === 0)
			continue;
		
		const payee_ids = await auction.payees.map(id => ObjectId(id));
		const payees = await User.find({ _id: { $in: payee_ids } }, { firstname: 1, lastname: 1, contact: 1 });
		
		const subject = 'Przypomnienie o obowiązku przedpłaty za kupiony przedmiot: ' + auction.title;
		const recipients = payees.map(user => ({ email: user.contact.email }));
		
		const mailer = new Mailer({ subject, recipients }, prepayTemplate(auction.title));
		await mailer.send();

		console.log(`prepay email sent to ${payees.length} people.`);
	}
}

const remindToRateEndedAuctions = async () => {
	const auctions = await Auction.find (
		{ ended: true, prepaid: true, rated: { $ne: true }}, // TODO paid ??
		{ _id: 1, title: 1, bids: 1 }
	).lean();

	const count = auctions.length;

	for (let i = 0; i < count; i++) {
		const auction = auctions[i];
		const bids = auction.bids.sort((bid_1, bid_2) => {
			if (bid_1.price < bid_2.price) return 1;
			if (bid_1.price > bid_2.price) return -1;
			return 0;
		});

		if (bids.length === 0)
			continue;

		const winner = await User.findOne({ _id: ObjectId(bids[0]._user) });
		const subject = 'Prośba o wystawienie opinii Sprzedawcy';
		const recipients = [{ email: winner.contact.email }];
		const mailer = new Mailer({ subject, recipients }, rateTemplate(auction.title));
		await mailer.send();
		console.log('rate request sent to ' + winner.firstname + ' ' + winner.lastname);
	}
}

// MAIN CRON JOB run maintenance task every day, minute before midnight
schedule.scheduleJob('59 23 * * *', async () => {
	// current auctions
	await schedulePendingAuctions();
	await disablePremiums();
	// not prepaid
	//await remindToPrepayEndedAuctions();

	// not paid TODO

	// not rated
	// await remindToRateEndedAuctions();

	// unread messages
	// await notifyAboutPendingChatMessages();
});
schedulePendingAuctions();
console.log('CRON JOB SCHEDULED');

module.exports = app => {
	app.get('/api/premiums', async(req, res) => {
		req.setTimeout(0);
		await disablePremiums();

		res.send(true);
	});

	app.get('/api/pendingmessages', async (req, res) => {
		req.setTimeout(0);
		await notifyAboutPendingChatMessages();
		res.send(true);
	});

	app.get('/api/rate', async (req, res) => {
		req.setTimeout(0);
		await remindToRateEndedAuctions();
		res.send(true);
	});

	app.get('/api/prepay', async (req, res) => {
		req.setTimeout(0);
		await remindToPrepayEndedAuctions();
		res.send(true);
	});

	app.get('/api/endauction/:id', async (req, res) => {
		req.setTimeout(0);
		const id = req.params.id;
		await endAuction(id);
		res.send(true);
	});

	app.get('/api/scheduleauctions', async (req, res) => {
		req.setTimeout(0);
		await schedulePendingAuctions();
		res.send(true);
	});
}