module.exports = app => {
	const fs = require('fs');
	const http = require('http');
	const https = require('https');
	const production = process.env.NODE_ENV === 'production';


	// SSL CERT
	const privateKey = production ? fs.readFileSync('../cert/privkey.pem', 'utf8') : null;
	const certificate = production ? fs.readFileSync('../cert/cert.pem', 'utf8') : null;
	const ca = production ? fs.readFileSync('../cert/chain.pem', 'utf8') : null;

	const credentials = {
    	key: privateKey,
    	cert: certificate,
    	ca: ca
  	};


	const chatServer = production ? https.createServer(credentials, app) : http.createServer(app);
	const socketIo = require('socket.io');
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
		// console.log('New client connected. session_id: ' + session_id); 
		
		socket.emit('handshake');

		socket.on('handshake', data => {
			user_id = String(data);
			auctionClientsOnline[session_id] = user_id;

			//console.log('clients online: ', auctionClientsOnline);
		});

		socket.on('message_user', user_id => {
			emitMessagePulse(socket, user_id);
		});

		socket.on('disconnect', () => {
			delete auctionClientsOnline[session_id];
			//console.log('Client disconnected. session_id: ' + session_id);
		});
	});

	chatServer.listen(9000, () => console.log('Chat server listening on port 9000'));
}