module.exports = app => {
	const http = require('http');
	const socketIo = require('socket.io');
	const chatServer = http.createServer(app);
	const io = socketIo(chatServer);

	const mongoose = require('mongoose');
	require('../models/Chat');
	const Chat = mongoose.model('chat');
	const { ObjectId } = mongoose.Types;

	const getChatsAndEmit = async (socket, id) => {
		
	}

	io.on('connection', socket => {
		console.log('New client connected'); 
		socket.emit('handshake');

		let _id;

		socket.on('get_chats', () => getChatsAndEmit(socket, _id));

		socket.on('handshake', data => {
			_id = data;
			console.log('handshake', _id);
		});

		socket.on('disconnect', () => console.log('Client disconnected'));
	});

	chatServer.listen(9000, () => console.log('Chat server listening on port 9000'));
}