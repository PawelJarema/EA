import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as profileActions from '../actions/profileActions';
import * as invoiceActions from '../actions/invoiceActions';
import './Profile.css';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import { Link } from 'react-router-dom';
import { CreateUpdateAuction } from './Auctions';
import { Opinions } from './OtherUser';
import Progress from './Progress';
import { Pagination } from './Pagination';
import RegexHelper from '../helpers/regexHelper';

import { isNotEmpty } from './auctions/functions';
import { UserHelper } from '../helpers/UserHelper';

moment.updateLocale('pl', {
   months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
   monthsShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
   weekdays: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
   weekdaysShort: ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'],
   weekdaysMin: ['Pn', 'Wt', 'Śr', 'Cz', 'Pi', 'So', 'Ni']
});

function username(user) {
    return `${user.firstname || ''} ${user.lastname || (user.firstname ? '' : 'Anonim')}`;
}

function userToState(user) {
    let state = {};
    
    state.firstname = (user.firstname || '');
    state.lastname = (user.lastname || '');
    state.birthdate = user.birthdate ? moment(user.birthdate) : moment();
    // state.pesel = user.pesel;

    if (user.firm) {
        let firm = user.firm;
        state.firm = 'firm';
        state.firm_name = firm.firm_name || '';
        state.nip = firm.nip || '';
    }
    if (user.address) {
        let address = user.address;
        state.street = address.street || '';
        state.postal = address.postal || '';
        state.city = address.city || ''
    }
    
    if (user.balance) {
        state.account_number = user.balance.account_number || '';
    }
    
    if (user.contact) {
        let contact = user.contact;
        state.email = contact.email || '';
        state.invoice_email = contact.invoice_email || '';
        state.phone = contact.phone || '';
    }
    
    if (user.agreements) {
        let agree = user.agreements;
        state.corespondence = agree.corespondence;
        state.rodo_1 = agree.rodo_1;
        state.rodo_2 = agree.rodo_2;
    }
    
    return state;
}
              
class ProfileLinks extends Component {
    render() {
        const active = this.props.active || '';
        const toggleOpen = (e) => {
            const a = e.target,
                cn = a.className;
            cn.indexOf(' open') === -1 ? a.className += ' open' : a.className = cn.replace(' open', '');
        };
        
        const 
            { user } = this.props,
            { credits } = user.balance || 0,
            userHasFreebies = user.freebies ? Boolean(user.freebies.auctions) : false,
            toSend = isNotEmpty(user.toSend),
            toRate = isNotEmpty(user.toRate);

        console.log(user.toSend);
        // console.log(user.freebies);

        return (
            <div className="links">
                <Link className={ active === 'settings' ? 'active' : null } to="/konto/ustawienia">Ustawienia konta</Link>
                <a href="#" className={ (active.indexOf('bids') !== -1 ? 'open' : '') } onClick={toggleOpen}>Moje licytacje</a>
                <div className="dropdown">
                    <Link className={ (active) === 'current_bids' ? 'active' : null } to="/moje-licytacje">Bieżące</Link>
                    <Link className={ (active) === 'ended_bids' ? 'active' : null } to="/moje-licytacje/zakonczone">Zakończone</Link>
                </div>
                <a href="#" className={(active.indexOf('auction') !== -1 || !(user && user.deliveries && user.deliveries.length) ? ' open' : '')} onClick={toggleOpen}>Moje aukcje</a>
                <div className="dropdown">
                    <Link className={ (active === 'auctiondelivery' ? 'active' : null) } to="/konto/aukcje/dostawa">Dostawa { user && (!user.deliveries || !user.deliveries.length) ? <i className="material-icons orange">warning</i> : ''  }</Link>
                    <Link className={ (active === 'addauction' ? 'active' : null) } to="/konto/aukcje/dodaj">Dodaj aukcję { !userHasFreebies && <span className="badge" title={`możesz dodać jeszcze ${credits}`}>{ credits }</span> }</Link>
                    <Link className={ (active === 'current_auctions' ? 'active' : null) } to="/moje-aukcje">Bieżące</Link>
                    <Link className={ (active === 'ended_auctions' ? 'active' : null) } to='/moje-aukcje/zakonczone'>Zakończone</Link>
                </div>
                <Link className={ (active) === 'liked' ? 'active' : null } to="/polubione-aukcje">Polubione aukcje</Link>
                <Link className={ (active === 'opinions' ? 'active' : null) } to="/konto/opinie">Opinie</Link>
                {
                    (toSend || toRate) &&  <Link className={ (active === 'send-rate' ? 'active' : null) } to="/konto/wyslij-i-ocen">Oznacz przedmioty jako wysłane i oceń kupujących</Link>
                }  
            </div>
        ); // <Link className={ (active === 'invoices' ? 'active' : null) } to="/konto/faktury">Faktury</Link>
    }
}

class Invoices extends Component {
    constructor(props) {
        super(props);

        this.state = { vat: false, page: 1, pages: 1, per_page: 10 };
        this.handlePagination = this.handlePagination.bind(this);
        this.sendInvoice = this.sendInvoice.bind(this);
    }

    componentDidMount() {
        const { page, per_page } = this.state;

        this.props.paginateInvoices(page, per_page);
    }

    componentWillReceiveProps(props) {
        if (props.invoices) {
            if (typeof props.invoices[props.invoices.length - 1] === 'number') {
                this.setState({ pages: props.invoices.pop() });
            }
        }
    }

    handlePagination(index) {
        const { per_page } = this.state;
        this.setState({ page: index}, () => {
            this.props.paginateInvoices(index, per_page);
        });
    }

    sendInvoice(invoice) {
        const { vat, page, per_page } = this.state;
        this.props.sendInvoice(invoice._id, vat);
        this.props.paginateInvoices(page, per_page);
    }

    render() {
        const { page, pages, vat } = this.state;
        const { user, invoices } = this.props;

        if (invoices === null) {
            return <Progress />;
        }

        if (!invoices || invoices.length === 0) {
            return (
                <div className="Profile ProfileSettings">
                    <ProfileLinks active="invoices" />
                    <div className="Invoices">
                        <div className="no-result">
                            <i className="material-icons">folder_open</i>
                            <h1>Brak danych</h1>
                            <p>Nie ma danych do ofakturowania</p>
                            <p>Aby wystawić fakturę, sprzedaj przedmiot</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="Profile ProfileSettings">
                <ProfileLinks active="invoices" />
                <div className="Invoices">

                    {
                        invoices.length > 10 && <Pagination page={page} pages={pages} clickHandler={this.handlePagination} />
                    }
                    <table>
                        {
                            invoices.length > 0 && (<thead>
                                <tr>
                                    <th>Nabywca i Tytuł</th>
                                    <th>Ilość (szt.)</th>
                                    <th>Opłaty</th>
                                    <th>Metoda dostawy</th>
                                    <th>
                                        <div>
                                             <input name="vat" type="checkbox" checked={ vat } onChange={(e) => this.setState({ vat: e.target.checked })} /> Prześlij z VAT
                                        </div>
                                    </th>
                                </tr>
                            </thead>)
                        }
                        <tbody>
                            {
                                invoices.map((invoice, index) => (
                                    <tr key={`invoice_${index}`}>
                                        <td>
                                            <span className="buyer">{ username(invoice.buyer) }</span>
                                            <span className="title">{ invoice.title }</span>
                                        </td>
                                        <td>
                                            { invoice.qty || 1 }
                                        </td>
                                        <td>
                                            <span className="item">{ invoice.price } zł</span>
                                            <span className="delivery">{ invoice.delivery_price } zł</span>
                                            <span className="price total">{ invoice.price + invoice.delivery_price } zł</span>
                                        </td>
                                        <td>
                                            <span className="delivery-method">{ invoice.delivery_method }</span>
                                        </td>
                                        <td>
                                            {
                                                <button className="standard-button" onClick={() => this.sendInvoice(invoice)}>{ (invoice.sent ? 'Przypomnij' : 'Wyślij') }</button>
                                            }
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <Pagination page={page} pages={pages} clickHandler={this.handlePagination} />
                </div>
            </div>
        )
    }
}

class MyOpinions extends Component {
    render() {
        const { user } = this.props;

        return (
            <div className="Profile ProfileSettings">
                <ProfileLinks active="opinions" />
                <div className="MyOpinions">
                    <Opinions other_user={user} />
                </div>
            </div>
        )
    }
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = { birthdate: moment(), message: [] };
        this.handleInput = this.handleInput.bind(this);
        this.handleDate = this.handleDate.bind(this);
        this.validate = this.validate.bind(this);
        this.submit = this.submit.bind(this);
    }

    componentWillMount() {
        if (this.props.user && Object.keys(this.state).length === 2) {
            this.setState(userToState(this.props.user));
        }
    }
    
    componentWillReceiveProps(props) {
        const user = props.user;
        
        if (user) {
            this.setState(userToState(user));
        }
    }
    
    handleInput(event) {
        const input = event.target;
        const name = input.name;
        const type = input.type;
        const value = type === 'checkbox' ? input.checked : input.value;
        
        this.setState({ [name]: value }, () => {
            if (this.state.message.length) {
                this.validate();
            }
        });
    }
    
    handleDate(date) {
        this.setState({ birthdate: date });
    }
    
    validate() {
        const state = this.state;
        const is18 = UserHelper.is18({ birthdate: this.state.birthdate.valueOf()});
        let message = [];
        
        if (!state.firstname) {
            message[0] = 'Wpisz imię';
        }
        if (!state.lastname) {
            message[1] = 'Wpisz nazwisko';
        }
        if (!state.street) {
            message[2] = 'Wpisz adres, na który chcesz dostawać przesyłki';
        }
        if (!state.postal) {
            message[3] = 'Wpisz kod pocztowy';
        }
        if (!state.city) {
            message[4] = 'Wpisz miasto';
        }
        if (!is18) {
            message[5] = 'Musisz mieć 18 lat aby korzystać z serwisu eaukcje.pl';
        }
        if (state.account_number && !RegexHelper.account.test(state.account_number)) {
            message[6] = 'Wpisz numer konta, na które będziesz otrzymywał wpłaty';
            console.log()
        }
        if (!state.email || !RegexHelper.email.test(state.email)) {
            message[7] = 'Podaj aktualny E-mail';
        }
        
        if (state.invoice_email && !RegexHelper.email.test(state.invoice_email)) {
            message[8] = 'Nieprawidłowy format E-maila do faktur';
        }

        // <p>
        //     <input name="pesel" type="number" placeholder="Pesel" value={state.pesel} onChange={handleInput} />
        //     <span className="validation-message">{ this.state.message[9] }</span>
        // </p>
        // if (!state.pesel || !RegexHelper.pesel.test(state.pesel)) {
        //     message[9] = 'Wymagany pesel: 11 cyfr';
        // }

        if (!state.phone || !RegexHelper.phone.test(state.phone)) {
            message[10] = 'Wymagany telefon';
        }

        if (state.firm) {
            if(!state.firm_name) {
                message[11] = 'Wpisz nazwę firmy';
            }
            if (!RegexHelper.nip.test(state.nip)) {
                message[12] = 'Wpisz poprawny NIP';
            }
        }

        this.setState({ message }, () => {
            let messages = document.querySelectorAll('.ProfileSettings .validation-message');
            for (let i = messages.length - 1; i >= 0; i--) {
                if (messages[i].innerHTML.length) {
                    messages[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return false;
                }
            }
        });
        
        if (message.length === 0) {
            return true;
        }
    }
    
    submit(event) {
        event.preventDefault();
        
        if (this.validate()) {
            let formData = new FormData(this.formRef);
            this.props.postProfile(formData);
        }
        
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
    
    destroy(event) {
        const consent = window.confirm('NAPEWNO USUNĄĆ KONTO? Tej operacji nie da się odwrócić!');
        
        if (!consent) {
            event.preventDefault();
        }
    }
    
    // <button type="submit" onClick={this.submit}>Dodaj numer konta</button>
    // <button type="submit" onClick={this.submit}>Zapisz</button>
    // <button type="submit" onClick={this.submit}>Zapisz</button>

    render() {
        const state = this.state;
        const handleInput = this.handleInput;

        return (
            <div className="Profile ProfileSettings">
                <ProfileLinks active="settings" />
                { this.props.user === null ? <Progress /> : <form ref={ (e) => this.formRef = e } className="user-settings" action="/user/update" method="post">
                    <h1>Ustawienia konta</h1>
                    <fieldset>
                        <legend><i className="material-icons">business</i>Firma</legend>
                        <p>
                            <span className="label add-horizontal-margin" style={{ marginLeft: -10 }}>
                                <input type="radio" name="firm" value="firm" onChange={handleInput} defaultChecked={state.firm} /><span className="label">Firma</span>
                                <input type="radio" name="firm" value={null} onChange={handleInput} defaultChecked={!state.firm} /><span className="label">Osoba prywatna</span>
                            </span>
                        </p>
                        {
                            state.firm && (<span>
                                <p>
                                    <label htmlFor="firm_name" className="required">Nazwa</label>
                                    <input name="firm_name" type="text" value={state.firm_name} onChange={handleInput} />
                                    <span className="validation-message">{ this.state.message[11] }</span>
                                </p>
                                <p>
                                    <label htmlFor="nip" className="required">NIP</label>
                                    <input name="nip" type="text" value={state.nip} onChange={handleInput} />
                                    <span className="validation-message">{ this.state.message[12] }</span>
                                </p>
                            </span>)
                        }   
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">account_circle</i>Dane osobowe</legend>
                        <p>
                            <label for="firstname" className="required">Imię</label>
                            <input name="firstname" type="text" value={state.firstname} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[0] }</span>
                        </p>
                        <p>
                            <label for="lastname" className="required">Nazwisko</label>
                            <input name="lastname" type="text" value={state.lastname} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[1] }</span>
                        </p>
                        <p>
                            <label for="street" className="required">Adres</label>
                            <input name="street" type="text" value={state.street} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[2] }</span>
                        </p>
                        <p>
                            <span className="labels">
                                <label for="postal" className="required">Kod pocztowy</label>
                                <label for="city" className="required">Miasto</label>
                            </span>
                            <input name="postal" type="text" value={state.postal} onChange={handleInput} />
                            <input name="city" type="text" value={state.city} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[3] }</span>
                            <span className="validation-message city">{ this.state.message[4] }</span>
                        </p>
                        
                        <p>

                            <span style={{ marginTop: 10, width: '100%' }} >
                                <div className="label">Data urodzenia</div>
                                <DatePicker dateFormat="DD/MM/YYYY" locale="pl" selected={this.state.birthdate} onChange={this.handleDate} showYearDropdown dropdownMode="select" />
                                <input name="birthdate" type="hidden" value={ this.state.birthdate.valueOf() } style={{ display: 'inline-block' }}/>
                                <span className="validation-message">{ this.state.message[5] }</span>
                            </span>
                        </p>
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">account_balance</i>Numer konta</legend>
                        <p>
                            <label for="account_number">Numer konta w banku</label>
                            <input name="account_number" type="text" value={state.account_number} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[6] }</span>
                        </p>

                        
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">email</i>Dane kontaktowe</legend>
                        <p>
                            <label for="email" className="required">E-mail</label>
                            <input name="email" type="text" value={state.email} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[7] }</span>
                        </p>
                        <p>
                            <label for="invoice_email">E-mail do faktur</label>
                            <input name="invoice_email" type="text" value={state.invoice_email} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[8] }</span>
                        </p>
                        <p>
                            <label for="phone" className="required">Telefon</label>
                            <input name="phone" type="text" value={state.phone} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[10] }</span>
                        </p>
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">notifications</i>Powiadomienia</legend>
                        <p className="checkbox">
                            <span>
                                <input name="corespondence" type="checkbox" checked={state.corespondence} onChange={handleInput} />
                                <span className="checkbox-value"></span>
                                <span className="label">Chcę otrzymywać powiadomienia</span>
                            </span>
                        </p>
                        
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">attachment</i>Rodo</legend>
                        <p className="checkbox">
                            <span>
                                <input name="rodo_1" type="checkbox" checked={state.rodo_1} onChange={handleInput} />
                                <span className="checkbox-value"></span>
                                <span className="label">Zapoznałem się <Link to="/regulamin">z regulaminem</Link> dot. przetwarzania danych osobowych</span>
                            </span>
                        </p>
                        <p className="checkbox">
                            <span>
                                <input name="rodo_2" type="checkbox" checked={state.rodo_2} onChange={handleInput} />
                                <span className="checkbox-value"></span>
                                <span className="label">Zgadzam się na przetwarzanie moich danych zgodnie z RODO</span>
                            </span>
                        </p>
                        
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">security</i>Zmień hasło</legend>
                        <p>
                            <input name="password" type="password" placeholder="Hasło" />
                        </p>
                        <p>
                            <input name="confirm_password" type="password" placeholder="Powtórz hasło" />
                        </p>
                        <br />
                        <button type="submit" onClick={this.submit}>Zapisz Ustawienia</button>
                    </fieldset>
                    
                    <fieldset>
                        <legend><i className="material-icons">delete</i>Usuwanie konta</legend>
                        <p className="label text">Usunięcie konta jest nieodwracalne. W wyniku tej operacji wszystkie dane zostaną utracone.</p>
                        <form action="/user/destroy" method="post">
                            <button type="submit" className="destroy" onClick={this.destroy}>Usuń konto</button>
                        </form>
                    </fieldset>
                </form>}
            </div>
        );   
    }
}

class Delivery extends Component {
    constructor(props) {
        super(props);

        this.state = { deliveries: 1, data: [], hints: [], focus: null };
        this.addDelivery = this.addDelivery.bind(this);
        this.focus = this.focus.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.submit = this.submit.bind(this);

        this.removeFunc = (event) => {
            const button = event.target;
            const input = button.previousSibling.children[0];
            console.log(button, input);

            const index = parseInt(input.name.replace('price_', '')) - 1;

            this.setState(prev => ({ deliveries: prev.deliveries - 1, data: prev.data.slice(0, index).concat(prev.data.slice(index + 1)) }));
        };
    }

    componentWillMount() {
        if (this.props.user && this.props.user.deliveries && !this.state.data.length) {
            this.setState({ deliveries: this.props.user.deliveries.length, data: this.props.user.deliveries });
        }
    }

    componentWillReceiveProps(props) {
        if (props.user && props.user.deliveries) {
            this.setState({ deliveries: props.user.deliveries.length, data: props.user.deliveries });
        }
    }

    addDelivery() {
        this.setState(prev => ({ deliveries: prev.deliveries + 1 }));
    }

    focus(index) {
        this.setState({ focus: index });
    }

    handleInput(event) {
        const input = event.target;
        const value = input.value;
        const type = input.type === 'number' ? 'price' : 'name';
        const index = parseInt(input.name.replace(/(price_)|(delivery_)/, '')) - 1;

        
        const data = this.state.data;
        const methodsChosen = data.map(d => d.name);

        const hints = ['DPD', 'DHL', 'GLS', 'InPost', 'UPS', 'FedEx', 'Poczta Polska', 'odbiór osobisty'].filter(hint => new RegExp(value, 'i').test(hint));

        this.setState(prev => {
            let data = prev.data;
            if (!data[index]) {
                data.push({ [type]: value });
            } else {
                data[index][type] = value;
            } 

            return ({ data, hints });
        });
    }

    submit(event) {
        event.preventDefault();
        if (this.state.deliveries < 1) {
            alert('Dodaj chociaż jedną metodę dostawy');
            return;
        }

        const formData = new FormData(this.formRef);
        this.props.postDeliveries(formData);
    }

    render() {
        const deliveries = this.state.data;
        const { hints, focus } = this.state;

        return (
            <div className="Profile Delivery">
                <ProfileLinks active="auctiondelivery"/>
                {
                    this.props.user === null ? <Progress /> 
                    :
                    (<form ref={ (e) => this.formRef = e } className="user-settings" action="/user/delivery" method="post">
                        <h1>Metody dostawy towaru</h1>
                        <fieldset>
                            <legend><i className="material-icons">local_shipping</i>Przewoźnicy</legend>
                            <ol>
                                <li>Określ sposoby dostawy sprzedawanych towarów</li> 
                                <li>Podaj ceny, które naliczysz za wysyłkę</li> 
                                <li>Wzbogać listę przewoźników, aby uatrakcyjnić swoją ofetrę</li>
                            </ol>
                            <br />
                            <p ref={ (e) => this.deliveriesRef = e } className="deliveries">
                                {
                                    Array.from({ length: this.state.deliveries}, (v, k) => k + 1).map(index => (
                                        <div className="hint-wrapper" key={'deliveries_' + index}>
                                            <input className="hinted" name={'delivery_' + (index)} type="text" placeholder="Nazwa przewoźnika" value={ this.state.data[index - 1] ? this.state.data[index - 1].name : '' } onChange={this.handleInput} onFocus={() => this.focus(index - 1)} />
                                            <span className="price-input-wrapper"><input name={'price_' + (index)} type="number" placeholder="Cena dostawy" min="0" step="0.01" value={ this.state.data[index - 1] ? this.state.data[index - 1].price : null } onChange={this.handleInput}/></span>
                                            <i className="material-icons remove" onClick={this.removeFunc}>remove_circle_outline</i>
                                            {
                                                hints.length > 0 && focus === (index - 1) && (
                                                    <ul className="hint-list">{ 
                                                        hints.map((hint, hint_index) => ( 
                                                            <li key={"hint_" + hint_index} onClick={
                                                                () =>  {                             
                                                                    this.setState(prev => {
                                                                        let data = prev.data || [];
                                                                        if (!data[index - 1]) {
                                                                            data.push({ name: hint });
                                                                        } else {
                                                                            data[index - 1]['name'] = hint;
                                                                        }

                                                                        return ({ data, hints: [], focus: -1 });
                                                                    });

                                                                }
                                                            }>{hint}</li> 
                                                        )) 
                                                    }</ul>
                                                )
                                            }
                                        </div>
                                    ))
                                }
                            </p>
                            <p>
                                <span className="label add" onClick={this.addDelivery}><i className="material-icons">add_circle_outline</i>Dodaj metodę dostawy</span>
                            </p>

                            <br />
                            <button type="submit" onClick={this.submit}>Zapisz</button>
                        </fieldset>


                    </form>)
                }
            </div>
        )
    }
}

function mapUserStateToProps({ user }) {
    return { user };
}

function mapUserAndInvoiceStateToProps({ user, invoices }) {
    return { user, invoices };
}

Invoices = connect(mapUserAndInvoiceStateToProps, invoiceActions)(Invoices);
MyOpinions = connect(mapUserStateToProps)(MyOpinions);
ProfileLinks = connect(mapUserStateToProps)(ProfileLinks);
Settings = connect(mapUserStateToProps, profileActions)(Settings);
Delivery = connect(mapUserStateToProps, profileActions)(Delivery);

export { ProfileLinks, Settings, CreateUpdateAuction, Delivery, MyOpinions, Invoices };