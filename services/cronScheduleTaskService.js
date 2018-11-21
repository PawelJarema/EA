const schedule = require('node-schedule');

const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

require('../models/User');
require('../models/Auction');
const User = mongoose.model('user');
const Auction = mongoose.model('auction');

const dayInMillis = 1000 * 60 * 60 * 24;

let lastAuctionListed = 0;	// last auction listed as pending for verdict
let auctionsPendingVerdict = [];

const Mailer = require('./Mailer');
const wonTemplate = require('./emailTemplates/wonTemplate');
const lostTemplate = require('./emailTemplates/lostTemplate');
const itemSoldTemplate = require('./emailTemplates/itemSoldTemplate');
const itemNotSoldTemplate = require('./emailTemplates/itemNotSoldTemplate');
const prepayTemplate = require('./emailTemplates/prepayTemplate');
const rateTemplate = require('./emailTemplates/rateTemplate');

const notifyWinnerAboutAuctionEnd = (auction, winner) => {
	let subject = `Wygrałeś licytację przedmiotu: ${ auction.title }`;
	let recipients = [{ email: winner.contact.email }];

	const winnerMailer = new Mailer(
		{ subject, recipients }, 
		wonTemplate(
			auction._id, 
			auction.title, 
			auction.price.current_price
		)
	);

	winnerMailer.send();
}

const notifyOwnerAboutAuctionEnd = (auction, owner, winner) => {
	const subject = `Sprzedałeś przedmiot ${auction.title}`;
	const recipients = [{ email: owner.contact.email }];
	const ownerMailer = new Mailer(
		{ subject, recipients }, 
		itemSoldTemplate(
			auction._id, 
			auction.title, 
			`${winner.firstname} ${winner.lastname}`, 
			auction.price.current_price
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

	if (bids.length >= 2) {
		winning_bid = bids[0];
		winningUser = await User.findOne({ _id: ObjectId(winning_bid._user) });

		subject = `Zakończyła się licytacja przedmiotu: "${ auction.title }"`;
		recipients = [];

		let lostBids = bids.slice(1);
		for (let i = 0, l = lostBids.length; i < l; i++) {
			const bid = lostBids[i];
			const user = await User.findOne({ _id: ObjectId(bid._user) });

			recipients.push({ email: user.contact.email });
			console.log('part-taker email assigned');
		}

		const loserMailer = new Mailer(
			{ subject, recipients }, 
			lostTemplate(auction.title)
		);
		await loserMailer.send();

		notifyWinnerAboutAuctionEnd(auction, winningUser);
		notifyOwnerAboutAuctionEnd(auction, owner, winningUser);

	} else if (bids.length === 1 ){
		winning_bid = bids[0];
		winningUser = await User.findOne({ _id: ObjectId(winning_bid._user) });

		notifyWinnerAboutAuctionEnd(auction, winningUser);
		notifyOwnerAboutAuctionEnd(auction, owner, winningUser);

	} else {
		let subject = `Nie udało się sprzedać przedmiotu ${auction.title}`;
		let recipients = [{ email: owner.contact.email }];

		const ownerMailer = new Mailer({ subject, recipients }, itemNotSoldTemplate(auction._id, auction.title));
		await ownerMailer.send();
	}

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
		{ _id: 1, bids: 1, title: 1 }
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
		const subject = 'Przypomnienie o obowiązku przedpłaty za kupiony przedmiot: ' + auction.title;
		const recipients = [{ email: winner.contact.email }];
		const mailer = new Mailer({ subject, recipients }, prepayTemplate(auction.title));
		await mailer.send();
		console.log('prepay email sent to ' + winner.firstname + ' ' + winner.lastname)
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
	
	// not prepaid
	await remindToPrepayEndedAuctions();

	// not paid TODO

	// not rated
	await remindToRateEndedAuctions();
});
console.log('CRON JOB SCHEDULED');

module.exports = app => {
	app.get('/api/rate', (req, res) => {
		req.setTimeout(0);
		remindToRateEndedAuctions();
	});

	app.get('/api/prepay', (req, res) => {
		req.setTimeout(0);
		remindToPrepayEndedAuctions();
	});

	app.get('/api/endauction/:id', (req, res) => {
		req.setTimeout(0);
		const id = req.params.id;
		endAuction(id);
	});

	app.get('/api/scheduleauctions', (req, res) => {
		req.setTimeout(0);
		schedulePendingAuctions();

	});
}

