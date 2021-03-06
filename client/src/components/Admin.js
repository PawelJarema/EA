import React, { Component } from 'react';
import { Link, NavLink, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as adminActions from '../actions/adminActions';
import * as techBreakActions from '../actions/techBreakActions';
import * as categoryActions from '../actions/categoryActions';
import './Admin.css';

import Categories from './admin/Categories';

import Modal from './Modal';
import Progress from './Progress';
import { Pagination } from './Pagination';

import AuctionEndHelper from '../helpers/auctionEndHelper';

class NoDocuments extends Component {
	render() {
		return (
			<div className="absolute-center">
				<p className="transparent"><i className="material-icons" style={{marginRight: 10}}>filter_none</i>Na razie nic tu nie ma</p>
			</div>
		);
	}
}

class BulkMail extends Component {
	constructor(props) {
		super(props);
		this.bulkSendMessage = this.bulkSendMessage.bind(this);
	}

	bulkSendMessage(e) {
		e.preventDefault();
		const { admin } = this.props;

		if (admin) {
			const formData = new FormData(this.messageFormRef);
			formData.append('admin_id', admin._id);
			this.props.bulkSendMail(formData);
		}
	}

	render() {
		const { admin } = this.props;

		if (!admin)
			return <Redirect to="/admin" />

		return (
			<div className="mail-base">
				<h1>Baza mailingowa</h1>
				<h3><i className="material-icons">mail_outline</i>Wyślij wiadomość do wszystkich użytkowników</h3>
				<form ref={ (e) => this.messageFormRef = e }>
					<input name="subject" type="text" placeholder="wpisz tytuł" />
					<textarea name="message" placeholder="wpisz wiadomość" />
					<button className="standard-button" onClick={this.bulkSendMessage}><i className="material-icons">mail_outline</i>Wyślij</button>
				</form>
			</div>
		);
	}
}

class AuctionList extends Component {
	constructor(props) {
		super(props);
		this.state = { page: 1, pages: 1, per_page: 5, mailbox: false };

		this.paginateTo = this.paginateTo.bind(this);
		this.openMailbox = this.openMailbox.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentWillReceiveProps(props) {
		if (props.documents) {
			const { documents } = props;

			if (typeof documents.count === 'number') {
				applyToTable((e) => e.style.opacity = 1);
				this.setState({ pages: documents.count });
			}
		}
	}

	componentDidMount() {
		this.paginateTo(1);
	}

	paginateTo(page) {
		const { admin } = this.props;
		const { pages, per_page } = this.state;

		if (admin) {
			applyToTable((e) => e.style.opacity = 0.8);
			this.setState({ page }, () => this.props.paginateDocuments({ admin_id: admin._id, doctype: 'auction', page, per_page }));
		}
	}

	openMailbox(email, title) {
		this.setState({ mailbox: { email, title} });
	}

	sendMessage() {
		const { title, email } = this.state.mailbox;
		const formData = new FormData(this.messageFormRef);
		formData.append('email', email);
		formData.append('title', title);

		this.setState({ mailbox: false }, () => this.props.mailUser(formData));
	}

	deleteAuction({ id, title, email }) {
		const confirm = window.confirm(`Czy napewno chcesz usunąć aukcję ${title}?`);
		if (confirm) {
			const prompt = window.prompt('Proszę podać powód usunięcia');
			const documents = this.props.documents['auction'];

			const { admin } = this.props;
			const { per_page } = this.state;

			let page = this.state.page; 
			if (documents.length === 1) {
				page = (page - 1) || 1;
			}

			this.props.deleteAuctionAndPaginate({ auction_id: id, email, title, reason: prompt, admin_id: admin._id, doctype: 'auction', page, per_page });
		}
	}


	render() {
		const documents = this.props.documents && this.props.documents['auction'];
		const { page, pages, mailbox } = this.state;
		const { admin } = this.props;

		if (!admin) 
			return <Redirect to="/admin" />;

		if (documents) {
			return (
				<div className="auction-list">
					{
						mailbox && (
							<Modal
								title={<span><i className="material-icons">mail_outline</i>Wyślij wiadomość w temacie auckji {mailbox.title}</span>}
								actions={<button className="standard-button" onClick={this.sendMessage}>Wyślij</button>}
								open={mailbox}
								close={() => this.setState({mailbox:false})}
							>
								<form ref={ (e) => this.messageFormRef = e }>
									<input name="subject" type="text" placeholder="wpisz tytuł" />
									<textarea name="message" placeholder="wpisz wiadomość"></textarea>
								</form>

							</Modal>
						)
					}
					<Pagination page={page} pages={pages} clickHandler={this.paginateTo} />
					<table>
						<thead>
							<tr>
								<th>Sprzedawca</th>
								<th>Przedmiot</th>
								<th>Opis</th>
								<th>Cena</th>
								<th>Licytujący</th>
								<th>Polubienia</th>
								<th className="icon"><i className="material-icons">alarm</i></th>
								<th>Akcje</th>
							</tr>
						</thead>
						<tbody>
							{
								documents.map((doc, index) => (
									<tr key={"auction_"+ index}>
										<td>{doc.owner}</td>
										<td>{doc.title}</td>
										<td>{doc.shortdescription}</td>
										<td><span className="price">{doc.price.current_price}</span></td>
										<td>{doc.bids.length || 0}</td>
										<td>{doc.likes || 0}</td>
										<td>{AuctionEndHelper(doc.date)}</td>
										<td>
											<i className="material-icons" onClick={ (e) => window.open('/aukcje/' + doc._id, '_blank').focus() } title="zobacz">open_in_new</i>
											<i className="material-icons" onClick={ (e) => this.openMailbox(doc.email, doc.title) } title="wyślij wiadomość sprzedawcy">mail_outline</i>
											<i className="material-icons" onClick={ (e) => this.deleteAuction({id: doc._id, title: doc.title, email: doc.email})} title="usuń">delete_forever</i>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
					<Pagination page={page} pages={pages} clickHandler={this.paginateTo} />
				</div>
			);
		} else if (documents === null || documents === undefined) {
			return <Progress />
		} else if (documents === false) {
			return <NoDocuments />;
		}
		
	}
}

class UserList extends Component {
	constructor(props) {
		super(props);

		this.state = { page: 1, pages: 1, per_page: 10, mailbox: false };

		this.paginateTo = this.paginateTo.bind(this);
		this.openMailbox = this.openMailbox.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentWillReceiveProps(props) {
		if (props.documents) {
			const { documents } = props;

			if (typeof documents.count === 'number') {
				this.setState({ pages: documents.count });
				applyToTable((e) => e.style.opacity = 1);
			}
		}
	}

	componentDidMount() {
		this.paginateTo(1);
	}

	openMailbox(email) {
		this.setState({ mailbox: { email } });
	}

	sendMessage() {
		const { email } = this.state.mailbox;
		const { admin } = this.props;

		const formData = new FormData(this.messageFormRef);
		formData.append('email', email);
		formData.append('admin_id', admin._id);

		this.setState({ mailbox: false }, () => this.props.mailUser(formData));
	}

	deleteUser({ id, name }) {
		const confirm = window.confirm(`Czy napewno chcesz usunąć użytkownika ${name} i wszystkie aukcje powiązane z jego kontem?`);
		if (confirm) {
			const prompt = window.prompt('Proszę podać powód usunięcia');
			const { admin, documents } = this.props;
			const { per_page } = this.state;

			let page = this.state.page; 
			if (documents.length === 1) {
				page = (page - 1) || 1;
			}

			this.props.deleteUserAndPaginate({ user_id: id, reason: prompt, admin_id: admin._id, doctype: 'user', page, per_page });
		}
	}

	paginateTo(page) {
		const { admin } = this.props;
		const { per_page } = this.state;

		if (admin) {
			applyToTable((e) => e.style.opacity = 0.8);
			this.props.paginateDocuments({ admin_id: admin._id, doctype: 'user', page, per_page });
			this.setState({ page });
		}
	}

	render() {
		const documents = this.props.documents && this.props.documents['user']; //users
		const { page, pages, mailbox } = this.state;
		const { admin } = this.props;

		if (!admin) 
			return <Redirect to="/admin" />;

		if (documents) {
			return (
				<div className="user-list">
					{
						mailbox && (
							<Modal
								title={<span><i className="material-icons">mail_outline</i>Wyślij wiadomość na {mailbox.email}</span>}
								actions={<button className="standard-button" onClick={this.sendMessage}>Send</button>}
								open={mailbox}
								close={() => this.setState({mailbox:false})}
							>
								<form ref={ (e) => this.messageFormRef = e }>
									<input name="subject" type="text" placeholder="wpisz tytuł" />
									<textarea name="message" placeholder="wpisz wiadomość"></textarea>
								</form>

							</Modal>
						)
					}
					<Pagination page={page} pages={pages} clickHandler={this.paginateTo} />
					<table>
						<thead>
							<tr>
								<th>Imię i nazwisko</th>
								<th>Email</th>
								<th>Adres</th>
								<th>Konto</th>
								<th>Zgoda na korespondencję</th>
								<th>Opinie</th>
								<th>Akcje</th>
							</tr>
						</thead>
						<tbody>
							{
								documents.map((doc, index) => (
									<tr key={"user_" + index}>
										<td>{ `${doc.firstname || ''} ${doc.lastname || (!doc.firstname ? 'Anonim' : '')}` }</td>
										<td>{ (doc.contact ? `${doc.contact.email}` : 'użytkownik nie dodał E-maila' ) }</td>
										<td>{ (doc.address ? `${doc.address.street}\n${doc.address.postal} ${doc.address.city}` : 'użytkownik nie dodał danych adresowych') }</td>
										<td>{ (doc.balance ? `${doc.balance.account_number}` : 'użytkownik nie dodał konta') }</td>
										<td>{ (doc.agreements ? (doc.agreements.corespondence ? 'Tak' : 'Nie') : 'Nie określono') }</td>
										<td title='głosy / średnia ocena'>{ `${doc.opinion.count} / ${doc.opinion.rate}` }</td>
										<td>
											{
												( doc.agreements && doc.agreements.corespondence ? <i className="material-icons action" onClick={() => this.openMailbox(doc.contact.email)} title="wyślij wiadomość">mail_outline</i> : null)
											}
											<i className="material-icons action" onClick={() => this.deleteUser({ id: doc._id, name: doc.firstname })} title="usuń">delete_forever</i>
										</td>
									</tr>
								))
							}
						</tbody>
					</table>
					<Pagination page={page} pages={pages} clickHandler={this.paginateTo} />
				</div>
			);
		} else if (documents === null || documents === undefined) {
			return <Progress />;
		} else if (documents === false) {
			return <NoDocuments />;
		} else {
			return null;
		}
	}
}

class Provision extends Component {
	constructor(props) {
		super(props);
		this.state = { provision: 3, premium7daysPrice: 6, premiumForeverPrice: 12 };
	}

	componentWillMount() {
		if (this.props.admin) {
			this.componentWillReceiveProps(this.props);
		}
	}

	componentWillReceiveProps(props) {
		if (props.admin) {
			const { provision, premium7daysPrice, premiumForeverPrice } = props.admin;
			this.setState({ provision, premium7daysPrice, premiumForeverPrice });
		}
	}

	render() {
		const { admin } = this.props;
		const { provision, premium7daysPrice, premiumForeverPrice } = this.state;

		if (!admin)
			return <Redirect to="/admin" />;

		return (
			<div className="Provision">
				<h1><i className="material-icons">attach_money</i> Opłaty</h1>

				<div className="row">
					<div className="col">
						<h3>Koszt wystawienia aukcji</h3>
						<p>Ustaw koszt, który poniesie sprzedawca wystawiając aukcję w serwisie</p>
					</div>
					<div className="col">
						<p>
							<input name="provision" type="range" min="0" max="30" step="1" value={ provision } onChange={(e) => this.setState({ provision: e.target.value })}/>
							<span>{ provision } zł</span>
						</p>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<h3>Koszt PREMIUM 7 dni</h3>
						<p>Ustaw koszt, który sprzedawca poniesie przy standardowym wyróżnieniu ogłoszenia</p>
					</div>
					<div className="col">
						<input name="premium7days" type="range" min="1" max="60" step="1" value={ premium7daysPrice } onChange={(e) => this.setState({ premium7daysPrice: e.target.value })}/>
						<span>{ premium7daysPrice } zł</span>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<h3>Koszt PREMIUM FOREVER</h3>
						<p>Ustaw koszt, który sprzedawca poniesie przy wyróżnieniu ogłoszenia do końca jego istnienia przy jednoczesnym oznaczeniu go metką jakości w wynikach wyszukiwania</p>
					</div>
					<div className="col">
						<input name="premiumForever" type="range" min="1" max="100" step="1" value={ premiumForeverPrice } onChange={(e) => this.setState({ premiumForeverPrice: e.target.value })}/>
						<span>{ premiumForeverPrice } zł</span>
					</div>
				</div>

				<button className="standard-button" onClick={() => this.props.postProvision({ admin_id: admin._id, provision, premium7daysPrice, premiumForeverPrice })}>Zapisz</button>
			</div>
		);
	}
}


class TechBreak extends Component {
	render() {
		return (
			<div className="TechBreak absolute-center">
				<i className="material-icons">power_off</i>
                <h1>Przerwa Techniczna</h1>
                <p>Zapraszamy później</p>
            </div>
		);
	}
}

class AdminLinks extends Component {
	constructor(props) {
		super(props);
		this.toggleTechBreak = this.toggleTechBreak.bind(this);
		this.logoutAdmin = this.logoutAdmin.bind(this);
	}

	toggleTechBreak() {
		const admin_id = this.props.admin._id;
		this.props.techBreak({ admin_id });
	}

	logoutAdmin() {
		this.props.logoutAdmin();
	}

	render() {
		const { tech_break } = this.props;

		return (
			<div className="links">
				<h2><i className="material-icons">verified_user</i>Administracja</h2>
				<NavLink to="/admin/prowizja" activeClassName="active">Opłaty</NavLink>
				<NavLink to="/admin/kategorie" activeClassName="active">Kategorie</NavLink>
				<NavLink to="/admin/uzytkownicy" activeClassName="active">Użytkownicy</NavLink>
				<NavLink to="/admin/aukcje">Aukcje</NavLink>
				<NavLink to="/admin/baza-mailingowa">Baza mailingowa</NavLink>
				<a onClick={this.logoutAdmin}>Wyloguj</a>
				{
					tech_break && <button className="standard-button" onClick={this.toggleTechBreak}>{( tech_break.techbreak ? <i className="material-icons">power_off</i> : <i className="material-icons">power</i>)}{( tech_break.techbreak ? 'Odwołaj przerwę techniczną' : 'Zarządź przerwę techniczną')}</button>
				}
			</div>
		);
	}
}

class AdminPanel extends Component {
	constructor(props) {
		super(props);

		this.state = { login: '', password: '' };

		this.handleInput = this.handleInput.bind(this);
		this.authAdmin = this.authAdmin.bind(this);
	}

	componentDidMount() {
		this.props.authAdmin();
	}

	handleInput(e) {
		const { name, value } = e.target;
		this.setState({ [name]: value });
	}

	authAdmin() {
		this.props.authAdmin(this.state);
	}

	render() {
		const { admin } = this.props;
		const { login, password } = this.state;


		return (
			<div className="Admin">
				{
					admin === false ? <Modal
						title={<span><i className="material-icons">verified_user</i>Zaloguj się jako administrator</span>}
						actions={<button className="standard-button" onClick={this.authAdmin}><i className="material-icons">arrow_forward</i>Zaloguj</button>}
						open={true}
						close={ () => window.location.href='/' }
					>
						<form className="admin-login">
							<input name="login" type="text" placeholder="login" onChange={this.handleInput} />
							<input name="password" type="password" placeholder="hasło" onChange={this.handleInput} />
						</form>
					</Modal>
					: 
					(	
						<div className="AdminPanel">
							<Switch>
								<AdminLinks />
							</Switch>
							<div style={{ width: '100%' }}>
								<Route path="/admin/prowizja" component={ Provision } />
								<Route path="/admin/kategorie" component={ Categories } />
								<Route path="/admin/uzytkownicy" component={ UserList } />
								<Route path="/admin/aukcje" component={ AuctionList } />
								<Route path="/admin/baza-mailingowa" component={ BulkMail } />
							</div>
						</div>
					)
				}
			</div>
		);
	}
}

function applyToTable(func) {
	const e = document.querySelector('table');
	if (e) func(e);
}

function mapAdminStateToProps({ admin }) {
	return { admin };
}

function mapAdminAndTechBreakStateToProps({ admin, tech_break }) {
	return { admin, tech_break };
}

function mapAdminAndDocumentStateToProps({ admin, documents }) {
	return { admin, documents };
}

AdminLinks = connect(mapAdminAndTechBreakStateToProps, {...techBreakActions, ...adminActions})(AdminLinks);
AdminPanel = connect(mapAdminStateToProps, adminActions)(AdminPanel);
Provision = connect(mapAdminStateToProps, adminActions)(Provision);
UserList = connect(mapAdminAndDocumentStateToProps, adminActions)(UserList);
AuctionList = connect(mapAdminAndDocumentStateToProps, adminActions)(AuctionList);
BulkMail = connect(mapAdminStateToProps, adminActions)(BulkMail);

export { AdminPanel, TechBreak };