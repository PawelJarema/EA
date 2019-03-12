import React, { Component } from 'react';
import { ProfileLinks } from './Profile';
import { auctionPath } from './auctions/functions';

class DataRow extends Component {
	constructor(props) {
		super(props);

		this.state = { userDetails: false };

		this.notify = this.notify.bind(this);
		this.rate = this.rate.bind(this);
		this.toggleDetails = this.toggleDetails.bind(this);
	}

	notify(row) {
		alert('notify');
	}

	rate(row) {
		alert('open rate');
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
					{ row.toSend && <button onClick={ () => this.notify(row) }>Powiadom o { row.count > 1 ? ' wysłaniu przedmiotów' : ' wysłaniu przedmiotu' }</button> } 
					{ row.toRate && <button onClick={ () => this.rate(row) }>Wystaw opinię</button> }
				</td>
			</tr>
		);
	}
}

class ProfileSendAndRateBuyer extends Component {
	constructor(props) {
		super(props);

		this.state = { rows: [] };

		this.fetchRows = this.fetchRows.bind(this);
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

	render() {
		const { rows } = this.state;
		console.log(rows);
		
		return (
			<div className="Profile PrifileSendAndRateBuyer">
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
								rows.map((row, i) => <DataRow key={ 'row_' + i } row={ row } />)
							}
						</tbody>
					</table>
				</div>
			</div>
		)
	}
}

export default ProfileSendAndRateBuyer;