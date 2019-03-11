import React, { Component } from 'react';
import { ProfileLinks } from './Profile';

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
				</div>
			</div>
		)
	}
}

export default ProfileSendAndRateBuyer;