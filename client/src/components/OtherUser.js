import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as otherUserActions from '../actions/otherUserActions';
import * as opinionActions from '../actions/opinionActions';
import './OtherUser.css';
import Modal from './Modal';

import PriceHelper from '../helpers/priceHelper';
import SinceHelper from '../helpers/sinceHelper';
import DateHelper from '../helpers/dateHelper';
import { isNotEmpty } from './auctions/functions';

class UserData extends Component {
	render() {
		const { user } = this.props;
		return (
			<div className="user-detailed-data">
				{ user.address &&
					(
						<p>
							<i className="material-icons">domain</i>
							<span>
								{user.address.street} <br />
								{user.address.postal} {user.address.city}
							</span>
						</p>
					)
				}
				<p><i className="material-icons">mail_outline</i> { user.contact.email }</p>
				{
					user.contact.phone && <p><i className="material-icons">phone</i> { user.contact.phone }</p>
				}
				{
					user.balance.account_number && <p><i className="material-icons">account_balance</i> { user.balance.account_number }</p>
				}
			</div>
		);
	}
}
class Rating extends Component {
	render() {
		const { rating } = this.props;

		return (
			<div>
				{
					Array.from({ length: 5 - (5 - rating) }, (v, k) => k).map(i => (
						<i key={'star_' + i} className="material-icons orange">star</i>
					))
				}
				{
					Array.from({ length: 5 - rating }, (v, k) => k).map(i => (
						<i key={'empty_star_' + i} className="material-icons orange">star_outline</i>
					))
				}
			</div>
		);
	}
}

class Opinions extends Component {
	constructor(props) {
		super(props);
		this.state = { opinions: [], fetched: 0, per_fetch: 4, more: true };
		this.fetchMore = this.fetchMore.bind(this);
	}

	componentWillUnmount() {
		this.props.clearOpinions();
	}

	componentWillReceiveProps(props) {
		if (props.opinions) {
			const opinion_count = props.opinions.length;
			if (opinion_count) {
				this.setState(prev => ({ opinions: prev.opinions.concat(props.opinions), fetched: (opinion_count ? prev.fetched + opinion_count : -1), more: opinion_count === prev.per_fetch }));
			} else {
				this.setState({ more: false });
			}
		}
	}

	fetchMore() {
		const data = { 
			user_id: this.props.other_user._id, 
			from: this.state.fetched, 
			count: this.state.per_fetch 
		};
		this.props.fetchOpinions(data);

	}

	render() {
		const { opinions, more } = this.state;
		const { other_user } = this.props;

		if (other_user && !this.first_fetch) {
			this.first_fetch = true;
			this.fetchMore();
		}

		if (opinions && opinions.length > 0) {
			return (
				<div className="opinions">
					<table>
					<tbody>
					{
						opinions.map((opinion, index) => (
							<tr key={"opinion_" + index}>
								<td><span className="auction-details"><span className="date">{DateHelper(opinion.date)}</span><br/><span className="title">{ opinion.auction }</span></span><h3 className="opinion">{ opinion.text }</h3><span className="rater">{opinion.rater}</span></td>
								<td><Rating rating={opinion.rate} /></td>
							</tr>
						))
					}
					</tbody>
					</table>
					{ more && <div style={{marginLeft: 18, marginBottom: 30}}><button className="standard-button" onClick={this.fetchMore}>Zobacz więcej...</button></div> }
				</div>
			);
		} else if (opinions && opinions.length === 0 && this.props.opinions) {
			return (
				<div className="no-result">
					<i className="material-icons">star_outline</i>
					<h1>Brak opinii</h1>
					<p>Sprzedawca nie ma jeszcze opinii</p>
				</div>
			);
		} else {
			return null;
		}
	}
}

class Deliveries extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const 
			auction = this.props.auction;

		if (auction && isNotEmpty(auction.deliveries)) {
			return (
				<div className="Deliveries">
					{
							<div className="delivery-methods">
								<h1><i className="material-icons">local_shipping</i>Metody dostawy</h1>
								<p>Dostępne metody dostawy:</p>
								<br />
								<table>
								<tbody>
								{
									auction.deliveries.map((delivery, index) => (
										<tr key={'delivery_' + index} className="delivery">
											<td className="name">{delivery.name}</td>
											<td className="price">{ PriceHelper.write(delivery.price) }</td>
										</tr>
									))
								}
								</tbody>
								</table>
							</div>
					}
				</div>
			);
		} else if (auction && !isNotEmpty(auction.deliveries)) {
			return (
				<div className="no-result">
					<i className="material-icons">local_shipping</i>
					<h1>Nie dodano metod dostawy</h1>
					<p>Sprzedawca nie dodał metod dostawy. <br /> Zapytaj o wysyłkę w zakładce 'Sprzedawca'</p>
				</div>
			);
		} else {
			return null;
		}
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
		const 
			user 	= this.props.stub || this.props.other_user,
			auction = this.props.auction,
			withUs 	= user ? SinceHelper(new Date().getTime() - user.joindate) : null,
			showAllData = this.props.showAllData;

		// TODO wystaw opinie tylko jeśli user znajduje się na liście raters
		// <button className="rate standard-button">Wystaw opinie</button> 
		return (
			<div className="OtherUser Seller">
				{
					user && (
						<div>
							<div className="user-data">
								<div className="column">
									<h3 className="name">{ `${user.firstname || ''} ${user.lastname || (!user.firstname && 'Anonim' : '')}` }</h3>
									{
										showAllData 
										?
										(
											<UserData user={user} />
										)
										:
										( 
											<div className="city">{ user.address ? user.address.city : null }</div>
										)
									}
									<div className="with-us transparent">{ (withUs ? `${ user.firstname || '' } jest z nami ${withUs}` : null) }</div>
								</div>
								<div className="column">
									<div className="stars">
										{
											user.rating !== null ? (
												<Rating rating={user.rating} />
											) : (
												<p className="">{user.firstname} nie ma jeszcze opinii.</p>
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
										!this.props.stub && auction._user !== this.props.user._id && (<div>
											<button className="message standard-button" onClick={this.openModal}><i className="material-icons">mail_outline</i> Zapytaj o przedmiot</button>
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
							<div className="auctions-title">
								<h3>Aukcje sprzedawcy</h3>
							</div>
							<ul className="auctions">
								{
									user.auctions && user.auctions.length > 0 ? user.auctions.map((auction, index) => (
										<li key={"auction" + index}><Link className="auction" to={`/aukcje/${auction._id}`}><div className="title">{auction.title}</div><div className="description">{auction.shortdescription}</div></Link></li>
									))
									:
									<div className="transparent" style={{ marginLeft: 20 }}>Brak czynnych auckji</div>
								}
							</ul>
						</div>
					)
				}
			</div>
		);
	}
}

function mapUserStateToProps({ user }) {
	return { user };
}

function mapOpinionStateToProps({ opinions }) {
	return { opinions };
}

function mapOpinionAndOtherUserStateToProps({ opinions, other_user }) {
	return { opinions, other_user };
}

function mapOtherUserStateToProps({ other_user }) {
	return { other_user };
}

Opinions = connect(mapOpinionStateToProps, opinionActions)(Opinions);
Seller = connect(mapOtherUserStateToProps, otherUserActions)(Seller);

export { Seller, Deliveries, Opinions };