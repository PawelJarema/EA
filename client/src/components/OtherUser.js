import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as otherUserActions from '../actions/otherUserActions';
import './OtherUser.css';
import Modal from './Modal';

function withUsSince(millis) {
	if (!millis) 
		millis = new Date((Math.random() * (new Date().getTime() - 60000) + 60000)).getTime();

	const years = ['rok', 'lata', 'lat'];
	const months = ['miesiąc', 'miesiące', 'miesięcy'];
	const days = ['dzień', 'dni'];
	const hours = ['godzinę', 'godziny', 'godzin'];

	const format = (num, arr) => {
		if (num <= 0) return '';
		if (num === 1) return `${num} ${arr[0]}`;
		if (num > 1 && num < 5 || num > 21 && num % 10 > 1 && num % 10 < 5) return `${num} ${arr[1] }`;
		return `${num} ${arr[2] || arr[1]}`;
	}

	const since = new Date().getTime() - millis;

	const hour = 1000 * 60 * 60;
	const day = hour * 24;
	const month = day * 30;
	const year = day * 365;

	const isYears = parseInt(since / year);
	const isMonths = parseInt((since - isYears * year) / month);
	const isDays = parseInt((since - isYears * year - isMonths * month) / day);
	const isHours = parseInt((since - isYears * year - isMonths * month - isDays * day) / hour);

	return `${format(isYears, years)} ${format(isMonths, months)} ${format(isDays, days)} ${format(isHours, hours)}`;
}

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
					user && user.deliveries && (
						<div className="delivery-methods">
							<h1><i className="material-icons">local_shipping</i>Dostawa</h1>
							{
								user.deliveries.map((delivery, index) => (
									<div key={'delivery_' + index} className="delivery">
										<span className="price">{delivery.name}<span className="value">{ delivery.price }</span></span>
									</div>
								))
							}
						</div>
					)
				}
				{
					!user || !user.deliveries && (
						<div className="no-results">
							<i className="material-icons">local_shipping</i>
							<h1>Nie dodano metod dostawy</h1>
							<p>Sprzedawca nie dodał metod dostawy. <br /> Zapytaj pytanie o wysyłkę w zakładce 'Sprzedawca'</p>
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
		this.setState({ modal: true });
	}

	closeModal() {
		this.setState({ modal: false });
	}

	sendQuestion(event) {
		event.preventDefault();

		const formData = new FormData(this.questionForm);
		this.props.postQuestion(formData);
		this.closeModal();
		window.scrollTo(0, 0);
	}

	componentWillReceiveProps(props) {

	}

	componentDidMount() {
		
	}

	render() {
		const user = this.props.other_user;
		const auction = this.props.auction;
		
		return (
			<div className="OtherUser Seller">
				{
					user && (
						<div>
							<div className="user-data">
								<div className="column">
									<h3 className="name">{ `${user.firstname} ${user.lastname}` }</h3>
									<div className="city">{ user.address.city }</div>
									<div className="with-us">{`${ user.firstname } jest z nami ${withUsSince( user.joindate )}`}</div>
								</div>
								<div className="column">
									<div className="stars">
										<i className="material-icons">star</i>
										<i className="material-icons">star</i>
										<i className="material-icons">star</i>
										<i className="material-icons">star</i>
										<i className="material-icons">star_border</i>
									</div>
									<div className="stats">
										<p>
											<span> 100 aukcji</span><span className="good">78</span><span>/</span><span className="bad">22</span>
										</p>
										<p>
											<span> 300 licytacji</span><span className="good">300</span><span>/</span><span className="bad">0</span>
										</p>
									</div>
								</div>
								<div className="column actions">
									<div>
										<button className="message standard-button" onClick={this.openModal}><i className="material-icons">mail_outline</i> Zapytaj o przedmiot</button>
										<button className="rate standard-button">Wystaw opinie</button>
									</div>
								</div>
								<Modal title={ <span><span className="thin"><i className="material-icons">mail_outline</i>Zadaj pytanie: </span>{auction.title}</span> } open={this.state.modal} actions={ <button className="standard-button" type="submit" onClick={this.sendQuestion}>Wyślij</button> } close={this.closeModal}>
                                    <form ref={(e) => this.questionForm = e}>
                                        <textarea name="question" placeholder="Wpisz treść"></textarea>
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