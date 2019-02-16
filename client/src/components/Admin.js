import React, { Component } from 'react';
import { Link, NavLink, Switch, Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as adminActions from '../actions/adminActions';
import * as techBreakActions from '../actions/techBreakActions';
import * as categoryActions from '../actions/categoryActions';
import './Admin.css';

// import Tree from 'react-ui-tree';
// import 'react-ui-tree/dist/react-ui-tree.css';
import Tree from './Tree';

import Modal from './Modal';
import Progress from './Progress';
import { Pagination } from './Pagination';

import AuctionEndHelper from '../helpers/auctionEndHelper';
import { isNotEmpty } from './auctions/functions';

let noteString = '';

class Property extends Component {
	constructor(props) {
		super(props);
		this.state = { prop: props.prop, open: false };

		this.skip = ['values', '_id', 'conditional_values'];
		this.names = {
			type: 'rodzaj pola',
			name: 'nazwa pola',
			unit: 'jednostka'
		};

		this.translateProp = (prop) => {
			const translate = {
				'Range': 'Pole liczbowe',
				'Singular': 'Pole tekstowe jednokrotnego wyboru',
				'Multiple': 'Pole tekstowe wielokrotnego wyboru'
			}

			if (translate[prop]) return translate[prop];
			return prop;
		}

		this.edit = (key, prop) => {
			switch(key) {
				case 'type':
					return (
						<select name={ key } value={ prop[key] } onChange={ this.handleChange }>
							<option value='Singular'>{ this.translateProp('Singular') }</option>
							<option value='Multiple'>{ this.translateProp('Multiple') }</option>
							<option value='Range'>{ this.translateProp('Range') }</option>
						</select>
					);
					break;
				default:
					return <input name={ key } type="text" value={ prop[key] } onChange={ this.handleChange } />
			} 
		}

		this.handleChange = this.handleChange.bind(this);
	}

	handleChange(e) {
		const
			{ prop } = this.state,
			input = e.target,
			name  = input.name,
			value = input.value;

		prop[name] = value;

		this.setState({ prop });
		this.props.updateProps(prop);
	}

	render() {
		const 
			{ prop, open } = this.state;

		return (
			<div className={ "property-editor-property" + (open ? ' open' : '')}>
				<span className="title" onClick={ () => this.setState({ open: !open }) }>{ prop.name }</span>
				{
					open && (
						<div className="property-editor-property-details">
							{
								Object.keys(prop).map((key, i) => {
									if (this.skip.indexOf(key) !== -1) return null;
									return (
										<div>
											{ this.names[key] }: 
											{ this.edit(key, prop) }
										</div>
									)
								})
							}
						</div>
					)
				}
			</div>
		);
	}
}

class PropertyEditor extends Component {
	updateProps(prop) {
		const 
			{ properties, updateProps } = this.props,
			index = properties.indexOf(prop);

		properties[index] = prop;
		updateProps(properties);
	}

	render() {
		const 
			{ properties } 	= this.props,
			numberProps 	= [],
			textProps 		= [];

		const updateProps = this.updateProps.bind(this);

		if (!isNotEmpty(properties)) return null;

		properties.map((prop, i) => {
			const key =  "prop_" + i;

			if (prop.type === 'Range') {
				numberProps.push(<Property key={ key } Property prop={prop} updateProps={ updateProps } />);
			} else {
				textProps.push(<Property key={ key } prop={prop} updateProps={ updateProps } />);
			}
		});

		return (
			<div className="PropertyEditor">
				<div className="property-editor-heading">Szablony Cech</div>
				<div className="property-editor-info">przeciągaj cechy na najgłębiej zagnieżdżone kategorie, <br/>potem ustawiaj wartości cech w powstałym w ten sposób kontekście</div>
				<div className="property-editor-subheading" title="występują jako pola jednokrotnego lub wielokrotnego wyboru. zawierają wartości tekstowe">cechy o wartościach tekstowych</div>
				<div className="property-editor-text-properties">
					{ textProps }
				</div>
				<div className="property-editor-subheading" title="występują jako pola - widełki. zawierają wartość liczbową">cechy o wartościach liczbowych</div>
				<div className="property-editor-number-properties">
					{ numberProps }
				</div>
			</div>
		)
	}
}

class NotePad extends Component {
	componentWillReceiveProps(props) {
		if (props.notes) {
			if (this.notesRef) {
				const value = this.notesRef.value;
				this.notesRef.value = (value  ? value + '\n\n' : '') + props.notes;
			}
		}
	}

	clear() {
		this.notesRef.value = '';
	}

	render() {
		const { notes } = this.props; 
		return (
			<div className="NotePad">
				<div className="title">
					Notatnik
					<span className="notepad-options">
						<i className="material-icons clickable" onClick={ this.clear.bind(this) }>delete_outline</i>
					</span>
				</div>
				<textarea ref={ (e) => this.notesRef = e } />
			</div>
		);
	}
}

class Categories extends Component {
	constructor(props) {
		super(props);

		this.state = { activeNode: null, tree: null, properties: null, notes: '' };

		this.treeChange = this.treeChange.bind(this);
		this.onClickNode = this.onClickNode.bind(this);
		this.renderNode = this.renderNode.bind(this);
		this.addCat = this.addCat.bind(this);
		this.updateProps = this.updateProps.bind(this);
	}

	componentDidMount() {
		if (!this.props.categories) {
			this.props.fetchCategories();
		}
	}

	componentWillReceiveProps(props) {
		if (props.categories && !this.state.tree) {
			this.setState({ tree: categoriesToTreeObject(props.categories), properties: categoriesToProperties(props.categories) }, () => this.setState({ notes: noteString }));
		}
	}

	treeChange(tree) {
		tree = recreateTreeIndexes(tree);
		this.setState({
			tree
		});
	}

	updateProps(props) {
		this.setState({
			properties: props
		});
	}

	addCat(node) {
		const 
			name 	 = window.prompt('Podaj nazwę'),
			{ tree } = this.state;

		let 
			index = -1,
			children = null;

		if (name) {
			switch(node.type) {
				case 'root':
					tree.children.unshift({ module: name, type: 'category' });
					break;
				case 'category':
					index 	 = node.index; // tree.children.indexOf(node);
					children = tree.children[index].children;

					if (!isNotEmpty(children)) tree.children[index].children = [];
					tree.children[index].children.unshift({ module: name, type: 'subcategory', parent_indexes: [index] });
					break;
				case 'subcategory':
					index = node.index; //tree.children[node.parent_indexes[0]].children.indexOf(node);
					children = tree.children[node.parent_indexes[0]].children[index].children;

					if (!isNotEmpty(children)) tree.children[node.parent_indexes[0]].children[index].children = [];
					tree.children[node.parent_indexes[0]].children[index].children.unshift({ module: name, type: 'subsubcategory', parent_indexes: [node.parent_indexes[0], index] });
					break;
			}


			this.treeChange(tree);
		}
	}

	removeCat(node) {
		const 
			confirm  = window.confirm('Napewno usunąć "' + node.module + '" i wszystkie podkategorie ?'),
			{ tree } = this.state;
		let 
			index,
			parent,
			children,
			change = false;

		if (confirm) {
			switch(node.type) {
				case 'category':
					index = node.index; //tree.children.indexOf(node);
					tree.children.splice(index, 1);
					change = true;
					break;

				case 'subcategory':
					parent = tree.children[node.parent_indexes[0]];
					index = node.index; //parent.children.indexOf(node);
					parent.children.splice(index, 1);
					change = true;
					break;

				case 'subsubcategory':
					parent = tree.children[node.parent_indexes[0]].children[node.parent_indexes[1]];
					index = node.index; //parent.children.indexOf(node);
					parent.children.splice(index, 1);
					change = true;
					break;
			}

			if (change) {
				this.treeChange(tree);
			}
		}
	}

	onClickNode(node) {
		this.setState({ activeNode: node });
	}

	renderNode(node) {
		const 
			{ activeNode } = this.state;

		let 
			options 	= [],
			collapsible = null;

		if (isNotEmpty(node.children)) {
			collapsible = <i className="material-icons" onClick={ () => { node.collapsed = !node.collapsed; }}>{ node.collapsed ? 'arrow_right' : 'arrow_drop_down' }</i>
		}
		if (node.type === 'category') {
			options = [
				<i key="a" className="material-icons" title="dodaj podkategorię" onClick={ () => this.addCat(node) }>playlist_add</i>,
				<i key="b" className="material-icons" title="usuń kategorię" onClick={ () => this.removeCat(node) }>close</i>
			]
		}
		if (node.type === 'subcategory') {
			options = [
				<i key="a" className="material-icons" title="dodaj podkategorię 3 poziomu" onClick={ () => this.addCat(node) }>playlist_add</i>,
				<i key="b" className="material-icons" title="usuń podkategorię" onClick={ () => this.removeCat(node) }>close</i>
			]
		}
		if (node.type === 'subsubcategory') {
			options = [<i key="b" className="material-icons" title="usuń kategorię 3 poziomu" onClick={ () => this.removeCat(node) }>close</i>]
		}


		return (
			<span 
				className={ 'node ' + node.type + ( node === activeNode ? ' is-active' : '' ) }
				onClick={ this.onClickNode.bind(null, node) }
			>
				<span className="tree-collapsible">{ collapsible }</span> { node.module } <span className="options">{ options }</span>
			</span>
		);
	}

	render() {
		return (
			<div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
				<Tree paddingLeft={20} tree={ this.state.tree } onChange={ this.treeChange } renderNode={ this.renderNode } addCat={ this.addCat } />
				<NotePad notes={ this.state.notes } />
				<PropertyEditor properties={ this.state.properties } updateProps={ this.updateProps }/>
			</div>
		);
	}
}

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
		this.state = { provision: 3 }
	}

	componentWillMount() {
		if (this.props.admin) {
			this.componentWillReceiveProps(this.props);
		}
	}

	componentWillReceiveProps(props) {
		if (props.admin) {
			const { provision } = props.admin;
			this.setState({ provision });
		}
	}

	render() {
		const { admin } = this.props;
		const { provision } = this.state;

		if (!admin)
			return <Redirect to="/admin" />;

		return (
			<div className="Provision">
				<h1>Opłaty</h1>
				<h3><i className="material-icons">attach_money</i>Koszt wystawienia aukcji</h3>
				<p>Ustaw koszt, który poniesie sprzedawca wystawiając aukcję w serwisie</p>
				<p>
					<input name="provision" type="range" min="1" max="60" step="1" value={provision} onChange={(e) => this.setState({ provision: e.target.value })}/>
					<span>{provision} zł</span>
				</p>
				<button className="standard-button" onClick={() => this.props.postProvision({ admin_id: admin._id, provision })}>Zapisz</button>
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

function recreateTreeIndexes(tree) {
	// categories
	if (isNotEmpty(tree.children)) {
		for (let c = 0; c < tree.children.length; c++) {
			tree.children[c].index = c;

			// subcategories
			if (isNotEmpty(tree.children[c].children)) {
				for (let sc = 0; sc < tree.children[c].children.length; sc++) {
					tree.children[c].children[sc].index = sc;
					tree.children[c].children[sc].parent_indexes = [c];

					// subsubcategories
					if (isNotEmpty(tree.children[c].children[sc].children)) {
						for (let ssc = 0; ssc < tree.children[c].children[sc].children.length; ssc++) {
							tree.children[c].children[sc].children[ssc].index = ssc;
							tree.children[c].children[sc].children[ssc].parent_indexes = [c, sc];
						}
					}
				}
			}
		}
	}

	return tree;
}

function categoriesToTreeObject(categories) {
	const tree = {
		module: 'Drzewo Kategorii',
		type: 'root',
		children: []
	};

	for (let c = 0; c < categories.length; c++) {
		const
			category 		= categories[c],
			category_name 	= category.name,
			category_index 	= c,
			subcategories 	= category.subcategories,
			categoryModule 	= {
				module: category_name,
				type: 'category',
				index: category_index
			};

		if (category.subcategories) {
			categoryModule.children = [];

			for (let sc = 0; sc < subcategories.length; sc++) {
				const
					subcategory 		= subcategories[sc],
					subcategory_name	= subcategory.name,
					subcategory_index 	= sc,
					properties 			= subcategory.properties,
					subcategoryModule   = {
						module: subcategory_name,
						category: category_name,
						type: 'subcategory',
						index: subcategory_index,
						parent_indexes: [category_index]
					};

				// podkategoria - albo ma cechy albo jeszcze jeden poziom kategorii
				if (subcategory.sub_subcategories) {
					subcategoryModule.children = [];

					const
						subsubcategories 		= subcategory.sub_subcategories;

					for (let ssc = 0; ssc < subsubcategories.length; ssc++) {
						const
							subsubcategory 			= subsubcategories[ssc],
							subsubcategory_name 	= subsubcategory.name,
							subsubcategory_index 	= ssc,
							properties 				= subcategory.properties,
							subsubcategoryModule 	= {
								module: subsubcategory_name,
								type: 'subsubcategory',
								index: subsubcategory_index,
								parent_indexes: [category_index, subcategory_index],
								leaf: true
							};

						if (properties) {
							subsubcategoryModule.properties = properties;
						}

						subcategoryModule.children.push(subsubcategoryModule);
					}
				} else if (properties) {
					subcategoryModule.leaf = true;
					subcategoryModule.properties = properties;
				}

				categoryModule.children.push(subcategoryModule);
			}
		} else {
			// categoryModule.leaf = true;
		}

		tree.children.push(categoryModule);
	}

	return tree;
}

function categoriesToProperties(categories) {
	let properties = [];
	noteString = '';

	for (let c = 0; c < categories.length; c ++) {
		const category = categories[c];
			
		if (isNotEmpty(category.properties)) {
			properties = concatUnique(properties, parseProperties(category.properties));
		}

		if (isNotEmpty(category.subcategories)) {
			for (let sc = 0; sc < category.subcategories.length; sc++) {
				const subcategory = category.subcategories[sc];
				
				if (isNotEmpty(subcategory.properties)) {
					properties = concatUnique(properties, parseProperties(subcategory.properties));
				}

				if (isNotEmpty(subcategory.sub_subcategories)) {
					for (let ssc = 0; ssc < subcategory.sub_subcategories.length; ssc++) {
						const subsubcategory = subcategory.sub_subcategories[ssc];
						
						if (isNotEmpty(subsubcategory.properties)) {
							properties = concatUnique(properties, parseProperties(subsubcategory.properties));
						}
					}
				}
			}
		}
	}

	for (let i = 0; i < properties.length; i++) {
		const prop = properties[i];
		noteString += `- Przykładowe Podpowiedzi dla Cechy "${ prop.name }":\n\n${ prop.values.join(', ') }\n\n\n`;
	}

	return properties;
}

function parseProperties(propArray) {
	return propArray;
}

function concatUnique(propArray_1, propArray_2) {
	const
		nameIndex = propArray_1.map(prop => prop.name),
		result = propArray_1.slice(0);

	for (let i = 0; i < propArray_2.length; i++) {
		const prop = propArray_2[i];
		if (nameIndex.indexOf(prop.name) === -1) {
			result.push(prop);
		}
	}

	return result;
}


function mapCategoryStateToProps({ categories }) {
	return { categories };
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
Categories = connect(mapCategoryStateToProps, categoryActions)(Categories);
UserList = connect(mapAdminAndDocumentStateToProps, adminActions)(UserList);
AuctionList = connect(mapAdminAndDocumentStateToProps, adminActions)(AuctionList);
BulkMail = connect(mapAdminStateToProps, adminActions)(BulkMail);

export { AdminPanel, TechBreak };