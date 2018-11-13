const requireLogin = require('../middleware/requireLogin');
const mongoose = require('mongoose');
require('../models/Chat');
const Chat = mongoose.model('chat');
const { ObjectId } = mongoose.Types;

const multer = require('multer');
const upload = multer();

module.exports = app => {
	app.get('/chats/get_all', requireLogin, async (req, res) => {
		const id = ObjectId(req.user._id);
		const chats = await Chat.find({ $or: [{ _user_1: id }, { _user_2: id }] }, {}, { sort: { date: -1 }, limit: 30 });

		res.send(chats);
	});

	app.post('/chats/message', [requireLogin, upload.any()], async (req, res) => {
		const _user_1 = ObjectId(req.user._id);
		const _user_2 = ObjectId(req.body._id);
		const _auction = ObjectId(req.body._auction);
		const title = req.body.title;
		const text = req.body.question;
		const date = new Date().getTime();

		const chat = await Chat.findOne({ 
			$and: [
				{ $or: [ { _user_1 }, { _user_1: _user_2 } ] },
				{ $or: [ { _user_2 }, { _user_2: _user_1 } ] }
			],
			title: { $regex: title, $options: 'i' }
		});

		const new_message = { 
			date, 
			_from: _user_1, 
			_to: _user_2, 
			//_auction, 
			title, 
			text, 
			seen: false 
		};

		if (chat) { 
			chat.messages.push(new_message);

			await chat.save().then(
				doc => req.session.message = 'Zadano pytanie',
				err => req.session.error = 'Wystąpił błąd. Spróbuj później'
			);
		} else {
			const chat = new Chat({ 
				title,
				date,
				_user_1,
				_user_2,
				_auction,
				messages: [new_message]
			}).save()
			.then(
				doc => req.session.message = 'Zadano pytanie', 
				err => req.session.error = 'Wystąpił błąd. Spróbuj później' 
			);
		};

		res.send(new_message);
	});
};