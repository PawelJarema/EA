module.exports = app => {
	const http = require('http');
	const socketIo = require('socket.io');
	const chatServer = http.createServer(app);
	const io = socketIo(chatServer);

	const mongoose = require('mongoose');
	require('../models/Chat');
	const Chat = mongoose.model('chat');
	const { ObjectId } = mongoose.Types;


	let auctionClientsOnline = {};

	const emitMessagePulse = (socket, user_id) => {
		console.log('incoming message for ' + user_id);
		socket.broadcast.emit(user_id);
	};

	io.on('connection', socket => {
		let session_id = String(socket.id), 
			user_id = null;
		console.log('New client connected. session_id: ' + session_id); 
		console.log('waiting for user_id.')
		
		socket.emit('handshake');

		socket.on('handshake', data => {
			user_id = String(data);
			console.log('new client identified with id: ', user_id);
			console.log('user_id: ' + user_id, ' session_id: ' + session_id);
			auctionClientsOnline[session_id] = user_id;

			console.log('\n', 'clients online: ', auctionClientsOnline);
		});

		socket.on('message_user', user_id => {
			console.log('trying to connect to user ' + user_id); 
			emitMessagePulse(socket, user_id);
		});

		socket.on('disconnect', () => {
			delete auctionClientsOnline[session_id];
			console.log('Client disconnected. session_id: ' + session_id);
		});
	});

	chatServer.listen(9000, () => console.log('Chat server listening on port 9000'));
}