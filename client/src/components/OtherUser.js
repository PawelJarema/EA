import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as otherUserActions from '../actions/otherUserActions';
import './OtherUser.css';
import Modal from './Modal';

import SinceHelper from '../helpers/sinceHelper';

class Deliveries extends Component {
	constructor(props) {
		super(props);
		this.id = props.id;
		this.state = {};
	}

	componentDidMount() {
		
	}

	render() {
		const user = this.props.other_user;

		return (
			<div className="Deliveries">
				{
					(user && user.deliveries.length !== 0) && (
						<div className="delivery-methods">
							<h1><i className="material-icons">local_shipping</i>Metody dostawy</h1>
							<p>Dostępne metody dostawy przedmiotu:</p>
							<br />
							{
								user.deliveries.map((delivery, index) => (
									<div key={'delivery_' + index} className="delivery">
										<span className="price"><span style={{ display: 'inline-block', width: 330}}>{index + 1}. {delivery.name}</span><span className="value">{ delivery.price }</span></span>
									</div>
								))
							}
						</div>
					)
				}
				{
					(!user || !user.deliveries.length) && (
						<div className="no-result">
							<i className="material-icons">local_shipping</i>
							<h1>Nie dodano metod dostawy</h1>
							<p>Sprzedawca nie dodał jeszcze metod dostawy. <br /> Zapytaj o wysyłkę w zakładce 'Sprzedawca'</p>
						</div>
					)
				}
			</div>
		);
	}
}

class Seller extends Component {
	constructor(props) {
		super(props);
		this.state = { modal: false };
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.sendQuestion = this.sendQuestion.bind(this);
	}

	openModal() {
		if (!this.props.user) {
			alert('Aby zadać pytanie, musisz się zalogować');
			return;
		}

		this.setState({ modal: true });
	}

	closeModal() {
		this.setState({ modal: false });
	}

	sendQuestion(event) {
		event.preventDefault();

		if (!this.messageTextRef.value) {
			alert('Wpisz wiadomość');
			return;
		}

		const formData = new FormData(this.questionForm);
		const { user, other_user, socket } = this.props;
		
		this.props.postQuestion(formData);
		this.closeModal();
		
		socket.emit('message_user', String(other_user._id));
		window.scrollTo(0, 0);
	}

	render() {
		const user = this.props.other_user;
		const auction = this.props.auction;
		const withUs = user ? SinceHelper(new Date().getTime() - user.joindate) : null;
		
		return (
			<div className="OtherUser Seller">
				{
					user && (
						<div>
							<div className="user-data">
								<div className="column">
									<h3 className="name">{ `${user.firstname} ${user.lastname}` }</h3>
									<div className="city">{ user.address ? user.address.city : null }</div>
									<div className="with-us">{ (withUs ? `${ user.firstname } jest z nami ${withUs}` : null) }</div>
								</div>
								<div className="column">
									<div className="stars">
										{
											user.rating !== null ? (
												<div>
													{
														Array.from({ length: 5 - (5 - user.rating) }, (v, k) => k).map(i => (
															<i key={'star_' + i} className="material-icons">star</i>
														))
													}
													{
														Array.from({ length: 5 - user.rating }, (v, k) => k).map(i => (
															<i key={'empty_star_' + i} className="material-icons bad">sentiment_dissatisfied</i>
														))
													}
												</div>
											) : (
												<p>{user.firstname} nie ma jeszcze opinii.</p>
											)
										}
										
									</div>
									<div className="stats">
										<p>
											<span> aukcje: {user.auction_count}</span><span className="good">{user.auction_count - user.bad_auctions}</span><span>/</span><span className="bad">{user.bad_auctions}</span>
										</p>
										<p>
											<span> licytacje: {user.bid_count}</span><span className="good">{user.bid_count - user.bad_bids}</span><span>/</span><span className="bad">{user.bad_bids}</span>
										</p>
									</div>
								</div>
								<div className="column actions">
									{
										auction._user !== this.props.user._id && (<div>
											<button className="message standard-button" onClick={this.openModal}><i className="material-icons">mail_outline</i> Zapytaj o przedmiot</button>
											<button className="rate standard-button">Wystaw opinie</button>
										</div>)
									}
								</div>
								<Modal title={ <span><span className="thin"><i className="material-icons">mail_outline</i></span><div className="title-text"><span className="thin">Zadaj pytanie: </span>{auction.title}</div></span> } open={this.state.modal} actions={ <button className="standard-button" type="submit" onClick={this.sendQuestion}>Wyślij</button> } close={this.closeModal}>
                                    <form ref={(e) => this.questionForm = e}>
                                        <textarea ref={(e) => this.messageTextRef = e} name="question" placeholder="Wpisz treść"></textarea>
                                        <input name="title" type="hidden" value={auction.title} />
                                        <input name="_id" type="hidden" value={user._id} />
                                        <input name="_auction" type="hidden" value={auction._id} />
                                    </form>
                                </Modal>
							</div>
							<div className="auctions">
								<h3>Aukcje sprzedawcy</h3>
								{
									user.auctions ? user.auctions.map((auction, index) => (
										<Link key={"auction" + index} className="auction" to={`/aukcje/${auction._id}`}><span className="lp">{index + 1}.</span>{auction.title}<span className="description">{auction.shortdescription}</span></Link>
									))
									:
									<div>Brak bieżących auckji</div>
								}
							</div>
						</div>
					)
				}
			</div>
		);
	}
}


function mapOtherUserStateToProps({ other_user }) {
	return { other_user };
}

Deliveries = connect(mapOtherUserStateToProps, otherUserActions)(Deliveries);
Seller = connect(mapOtherUserStateToProps, otherUserActions)(Seller);

export { Seller, Deliveries };