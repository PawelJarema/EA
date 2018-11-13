import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as chatActions from '../actions/chatActions';
import socketIOClient from 'socket.io-client';

import './Chat.css';

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: props.id,
			chats: [],
			messages: [],
			title: '',
			view: 'chats',
			endpoint: 'http://localhost:9000'
		};

		this.openChat = this.openChat.bind(this);
		this.closeChat = this.closeChat.bind(this);
	}

	componentWillReceiveProps(props) {
		if (props.chats) {
			this.setState({ chats: props.chats });
		}
	}

	componentDidMount() {
		const { endpoint, user_id } = this.state;
		const socket = this.socket = this.socket || socketIOClient(endpoint);
		this.props.fetchChats();

		socket.on("message", data => this.setState({ response: data }));
		socket.on("handshake", data => {
			socket.emit("handshake", user_id);
			socket.emit("get_chats");
		});
	}

	openChat(chat) {
		this.setState({ view: 'messages', messages: chat.messages, title: chat.title });
	}

	closeChat() {
		this.setState({ view: 'chats' });
	}

	render() {
		const { view, chats, messages, user_id, title } = this.state;

		return (
			<span className="Chat">
				<i className="material-icons">mail_outline</i>
				<div className="chat-box">
					{
						view === 'chats' && (
							chats.map((chat, index) => <p className="chat" onClick={() => this.openChat(chat)} key={"chat_" + index}>{ chat.title }</p>)
						)
					}
					{
						view === 'messages' && (
							<div className="chat-container">
								<div className="title">
									<i className="material-icons" onClick={this.closeChat}>arrow_back</i>{ title }
								</div>
								<div className="messages">
									{
										messages.map((message, index) => <p className={ (message._from === user_id ? 'mine' : 'his') }>{message.text}</p>)
									}
								</div>
								<div className="actions">
									<input name="new-message" type="text" placeholder="wpisz wiadomość" />
									<span className="icon-button orange">
										<i className='material-icons'>mail_outline</i>!
									</span>
								</div>
							</div>
						)
					}
				</div>
			</span>
		);
	}
}

function mapChatsStateToProps({ chats }) {
	return { chats };
}

export default connect(mapChatsStateToProps, chatActions)(Chat);