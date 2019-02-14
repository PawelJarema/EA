import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as chatActions from '../actions/chatActions';

import './Chat.css';

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: props.id,
			chats: [],
			chat: null,
			messages: [],
			unseen: 0,
			title: '',
			chatBoxOpen: false,
			chatBoxMode: 'chats',
			endpoint: process.env.REACT_APP_CHAT_URL
		};

		this.openChatBox = this.openChatBox.bind(this);
		this.openChat = this.openChat.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
		this.closeChat = this.closeChat.bind(this);
		this.scrollToBottom = this.scrollToBottom.bind(this);
	}

	componentWillReceiveProps(props) {
		if (props.chats) {
			const unseen = props.chats.pop();
			const chats = props.chats;
			
			let messages = null;
			if (this.state.chat) {
				const chat = chats.reduce((a, b) => a._id === this.state.chat._id ? a : b);
				if (chat) {
					messages = chat.messages;
				}

				console.log(chats, chat, messages);
			}

			
			this.setState({ chats, unseen, messages }, this.scrollToBottom);
		}
	}

	componentDidMount() {
		const socket = this.socket = this.props.socket;
		socket.on(String(this.props.id), () => { setTimeout(this.props.fetchChats, 600); });
		this.props.fetchChats();
	}

	openChatBox() {
		this.setState(prev => ({ chatBoxOpen: !prev.chatBoxOpen }));
	}

	openChat(chat) {
		let unseen = this.state.unseen;
		if (chat.unseen) {
			this.readAllInterval = setTimeout(() => this.props.readAllMessages(chat._id), 1000);
			chat.unseen = false;
			unseen -= 1;
		}
		
		this.setState({ chatBoxMode: 'messages', messages: chat.messages, title: chat.title, chat, unseen }, this.scrollToBottom);
	}

	closeChat() {
		this.setState({ chatBoxMode: 'chats' });
		if (this.readAllInterval) {
			clearTimeout(this.readAllInterval);
		}
	}

	scrollToBottom() {
		if (this.messagesRef) 
			this.messagesRef.scrollTop = this.messagesRef.scrollHeight;
		else {
			setTimeout(this.scrollToBottom, 50);
		}
	}

	sendMessage() {
		const { chat, user_id } = this.state;
		const text = this.messageInput.value;

		const me = user_id;
		const him = String(user_id) === String(chat._user_1) ? chat._user_2 : chat._user_1;
		if (!text) {
			return;
		}

		const newMessage = {
			_chat: chat._id,
			date: new Date().getTime(),
    		_from: me,
    		_to: him,
    		text: text,
    		seen: false
		};

		const formData = new FormData();
		for (let key in newMessage) {
			formData.append(key, newMessage[key]);
		}

		this.messageInput.value = '';
		this.props.postMessage(formData);
		this.socket.emit('message_user', him);
		this.scrollToBottom();
	}

	render() {
		const { chatBoxMode, chats, chat, messages, user_id, title, unseen } = this.state;
		const { callback, onClick } = this.props;

		const chatBox = (
			<div ref={ (e) => this.chatboxRef = e } className="chat-box">
				<div className="close-chat-box" onClick={this.openChatBox}><i className="material-icons">close</i></div>
				{
					chatBoxMode === 'chats' && (
						<div className="thread-container">
							<div className="title">
								<i className="material-icons">mail_outline</i>Wszystkie wątki
							</div>
							<div className="threads">
								{
									chats.map((chat, index) => <p className={"chat" + (chat.unseen ? ' unseen' : '')} onClick={() => this.openChat(chat)} key={"chat_" + index}>{ chat.title }{ chat.unseen ? <i className="material-icons new">new_releases</i> : null }</p>)
								}
							</div>
						</div>
					)
				}
				{
					chatBoxMode === 'chats' && !chats.length && <span className="no-mail absolute-center"><i className="material-icons">mail_outline</i><br/>nie masz wiadomości</span>
				}
				{
					chatBoxMode === 'messages' && (
						<div className="chat-container">
							<div className="title">
								<i className="material-icons" onClick={this.closeChat}>arrow_back</i><div className="title-text"><Link exact className="see-auction" to={'/aukcje/' + chat._auction}><i className="material-icons">search</i>{ title }</Link></div>
							</div>
							<div ref={(e) => this.messagesRef = e} className="messages">
								{
									messages.map((message, index) => <div className="message-row"><p className={'message' + (message._from === user_id ? ' mine' : ' his') }>{message.text}</p></div>)
								}
							</div>
							<div className="actions">
								<input ref={(e) => this.messageInput = e} name="new-message" type="text" placeholder="wpisz wiadomość" onKeyPress={ (e) => e.which === 13 ? this.sendMessage() : null}/>
								<span className="icon-button orange" onClick={this.sendMessage}>
									<i className='material-icons'>mail_outline</i>!
								</span>
							</div>
						</div>
					)
				}
			</div>
		);

		callback(this.state.chatBoxOpen ? chatBox : null);

		// { this.state.chatBoxOpen ? chatBox : null }
		return (
			<span className="Chat">
				<span className="wrapper"><i className="material-icons" onClick={() => { this.openChatBox(); onClick(); }}>mail_outline</i>{ unseen ? <span className="unseen-messages">{unseen}</span> : null}</span>
			</span>
		);
	}
}

function mapChatsStateToProps({ chats }) {
	return { chats };
}

export default connect(mapChatsStateToProps, chatActions)(Chat);