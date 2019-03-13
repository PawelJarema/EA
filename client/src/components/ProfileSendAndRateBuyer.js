import React, { Component } from 'react';
import { ProfileLinks } from './Profile';
import { RateModal } from './auctions/RateAuction';
import { isEmpty, isNotEmpty, auctionPath } from './auctions/functions';

class DataRow extends Component {
	constructor(props) {
		super(props);

		this.state = { userDetails: false };

		this.notify = this.notify.bind(this);
		this.rate = this.rate.bind(this);
		this.toggleDetails = this.toggleDetails.bind(this);
	}

	notify(row) {
		if (!this.actionInProgress) {
			this.actionInProgress = true;

			fetch('/auction/send_items', {
				headers: { 'Content-Type': 'application/json' },
				method: 'POST',
				body: JSON.stringify({ 
					auction_id: row.auction._id, 
					auction_title: row.auction.title,
					count: row.count,
					user_id: row.user._id,
					user_email: row.user.contact.split(/\s+/g)[0]
				})
			})
			.then(res => res.json())
			.then(success => {
				if (success) {
					alert(row.user.name + ' otrzyma powiadomienie o ' + wyslaniePlural(row));
					this.props.fetchRows();
				} else {
					alert('Nastąpił błąd. Spróbuj ponownie');
				}

				this.actionInProgress = false;
			})
		}
	}

	rate(row) {
		this.props.rateCallback(row);
	}

	toggleDetails() {
		this.setState(({ userDetails }) => ({ userDetails: !userDetails }));
	}

	render() {
		const 
			{ userDetails } = this.state,
			{ row } = this.props,
			contacts = row.user.contact.split(/\s+/g),
			email = contacts[0] ? contacts[0] : null,
			phone = contacts[2] ? contacts[2] : null; 

		return (
			<tr>
				<td>
					<span className="name clickable" onClick={ this.toggleDetails }><i className="material-icons">{ userDetails ? 'arrow_drop_down' : 'arrow_right' }</i> { row.user.name }</span>
					{
						userDetails && (
							<div>
								<span className="address">{ row.user.address }</span>
								<span className="contact">
									{ email && <span>email: <a className="clickable" href={ 'mailto:' + email }>{ email }</a></span> }
									<br />
									{ phone && <span>telefon: <a className="clickable" href={ 'tel:' + phone }>{ phone }</a></span>}
								</span>
							</div>
						)
					}
				</td>
				<td><a href={ auctionPath(row.auction) } target="_blank">{ row.auction.title }</a></td>
				<td>{ row.count }</td>
				<td>
					{ row.toSend && <button onClick={ () => this.notify(row) }>Powiadom o { wyslaniePlural(row) }</button> } 
					{ row.toRate && <button onClick={ () => this.rate(row) }>Wystaw opinię</button> }
				</td>
			</tr>
		);
	}
}

class ProfileSendAndRateBuyer extends Component {
	constructor(props) {
		super(props);

		this.state = { rows: [], rateModal: false, rate: 0, text: '' };

		this.fetchRows = this.fetchRows.bind(this);
		this.toggleModal = this.toggleModal.bind(this);
		this.rateCallback = this.rateCallback.bind(this);
		this.rate = this.rate.bind(this);
	}

	componentDidMount() {
		this.fetchRows();
	}

	fetchRows() {
		const 
			url = '/auction/send_and_rate_rows',
			user_id = String(this.props.user._id);

		fetch(url, {
			headers: { 'Content-Type': 'application/json' },
			method: 'POST',
			body: JSON.stringify({ user_id })
		})
		.then(res => res.json())
		.then(rows => this.setState({ rows }));
	}

	toggleModal() {
		this.setState(({ rateModal }) => ({ rateModal: !rateModal }));
	}

	rateCallback(row) {
		this.setState({ row, rateModal: true });
	}

	rate() {
        const { row, text, rate } = this.state;

        if (!text) {
            alert('Wystaw opinię i wybierz ilość gwiazdek');
            return;
        }

        if (!rate) {
            alert('Wybierz ilość gwiazdek');
            return;
        }
        
        const data = {
            date: new Date().getTime(),
            _user: row.user._id,
            isseller: false,
            isbuyer: true,
            auction: row.auction.title,
            _auction: row.auction._id,
            count: row.count,
            rate,
            text
        };

        fetch('/auction/rate_buyer', {
        	headers: { 'Content-Type': 'application/json' },
        	method: 'POST',
        	body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(success => {
        	if (success) {
        		alert('Wystawiono opinię');
        		this.toggleModal();
        		this.fetchRows();
        	} else {
        		alert('Nastąpił błąd. Spróbuj ponownie');
        	}
        })   
	}

	render() {
		const { rows, rateModal, row, text, rate } = this.state;

		if (isEmpty(rows)) return (
			<div className="Profile PrifileSendAndRateBuyer">
				<ProfileLinks active="send-rate" />
			</div>
		);

		return (
			<div className="Profile PrifileSendAndRateBuyer">
				{
					rateModal && <RateModal 
                        title={ <span><span className="thin">Wystaw opinię kupującemu: </span> { row.user.name }</span> }
                        rateCallback={ (i) => this.setState({ rate: i }) }
                        textCallback={ (e) => this.setState({ text: e.target.value }) }
                        submitCallback={ this.rate } 
                        closeCallback={ this.toggleModal }
                        open={ rateModal } 
                        text={ text }
                        rate={ rate } />
				}

				<ProfileLinks active="send-rate" />
				<div>
					<table className="send-and-rate-table">
						<thead>
							<tr>
								<th>Kupujący</th>
								<th>Aukcja</th>
								<th>Ilość zakupionych sztuk</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							{
								rows.map((row, i) => <DataRow key={ 'row_' + i } row={ row } fetchRows={ this.fetchRows } rateCallback={ this.rateCallback } />)
							}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}

function wyslaniePlural(row) {
	return row.count > 1 ? ' wysłaniu przedmiotów' : ' wysłaniu przedmiotu';
}

export default ProfileSendAndRateBuyer;