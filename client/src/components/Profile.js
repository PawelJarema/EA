import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as profileActions from '../actions/profileActions';
import './Profile.css';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import { Link } from 'react-router-dom';
import { CreateUpdateAction } from './Auctions';
import Progress from './Progress';

import RegexHelper from '../services/regexHelper';



moment.updateLocale('pl', {
   months: ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'],
   monthsShort: ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru'],
   weekdays: ['Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'],
   weekdaysShort: ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'],
   weekdaysMin: ['Pn', 'Wt', 'Śr', 'Cz', 'Pi', 'So', 'Ni']
});

function userToState(user) {
    let state = {};
    
    state.firstname = (user.firstname || '');
    state.lastname = (user.lastname || '');
    state.birthdate = user.birthdate ? moment(user.birthdate) : moment();
    
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
        state.corespondence = user.agreements.corespondence || true;
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
        
        return (
            <div className="links">
                <Link className={ active === 'settings' ? 'active' : null } to="/konto/ustawienia">Ustawienia konta</Link>
                <a href="#" onClick={toggleOpen}>Moje licytacje</a>
                <div className="dropdown">
                    <a href="#">Bieżące</a>
                    <a href="#">Zakończone</a>
                    <a href="#">Wystaw sprzedawcy opinię</a>
                </div>
                <a href="#" className={(active.indexOf('auction') !== -1 ? ' open' : '')} onClick={toggleOpen}>Moje aukcje</a>
                <div className="dropdown">
                    <Link className={ (active === 'addauction' ? 'active' : null) } to="/konto/aukcje/dodaj">Dodaj aukcję</Link>
                    <a href="#">Bieżące</a>
                    <a href="#">Zakończone</a>
                    <Link className={ (active) === 'auctiondelivery' ? 'active' : null } to="/konto/aukcje/dostawa">Ustaw opcje dostaw</Link>
                </div>
                <a href="#">Opinie</a>
                <a href="#">Wiadomości</a>
                <a href="#">Saldo</a>
            </div>
        );
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
        
        this.setState({ [name]: value });
        
        if (this.state.message.length) {
            this.validate();
        }
    }
    
    handleDate(date) {
        this.setState({ birthdate: date });
    }
    
    validate() {
        const state = this.state;
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
        if (!state.birthdate) {
            message[5] = 'Wprowadź datę urodzenia';
        }
        if (!state.account_number || !RegexHelper.account.test(state.account_number)) {
            message[6] = 'Wpisz numer konta, na które będziesz otrzymywał wpłaty';
        }
        if (!state.email || !RegexHelper.email.test(state.email)) {
            message[7] = 'Podaj aktualny E-mail';
        }
        
        if (state.invoice_email && !RegexHelper.email.test(state.invoice_email)) {
            message[8] = 'Nieprawidłowy format E-maila do faktur';
        }

        this.setState({ message }, () => {
            let messages = document.querySelectorAll('.ProfileSettings .validation-message');
            for (let i = message.length - 1; i >= 0; i--) {
                if (messages[i].innerHTML.length) {
                    messages[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return message.length === 0;
                }
            }
        });
        
        window.scrollTo({ top: 0, behavior: 'smooth'});

        return message.length === 0;
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
    
    render() {
        const state = this.state;
        const handleInput = this.handleInput;
        
        return (
            <div className="Profile ProfileSettings">
                <ProfileLinks active="settings" />
                { this.props.user === null ? <Progress /> : <form ref={ (e) => this.formRef = e } className="user-settings" action="/user/update" method="post">
                    <h1>Ustawienia konta</h1>
                    <fieldset>
                        <legend><i className="material-icons">account_circle</i>Dane osobowe</legend>
                        <p>
                            <input name="firstname" type="text" placeholder="Imię" value={state.firstname} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[0] }</span>
                        </p>
                        <p>
                            <input name="lastname" type="text" placeholder="Nazwisko" value={state.lastname} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[1] }</span>
                        </p>
                        <p>
                            <input name="street" type="text" placeholder="Adres" value={state.street} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[2] }</span>
                        </p>
                        <p>
                            <input name="postal" type="text" placeholder="Kod pocztowy" value={state.postal} onChange={handleInput} />
                            <input name="city" type="text" placeholder="Miasto" value={state.city} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[3] }</span>
                            <span className="validation-message city">{ this.state.message[4] }</span>
                        </p>
                        <p>
                            <span style={{ marginTop: 10 }} >
                                <div className="label">Data urodzenia</div>
                                <DatePicker dateFormat="DD/MM/YYYY" locale="pl" selected={this.state.birthdate} onChange={this.handleDate} showYearDropdown dropdownMode="select" />
                                <input name="birthdate" type="hidden" value={ this.state.birthdate.valueOf() } />
                                <span className="validation-message">{ this.state.message[5] }</span>
                            </span>
                        </p>
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">account_balance</i>Numer konta</legend>
                        <p>
                            <input name="account_number" type="text" placeholder="Numer konta bankowego" value={state.account_number} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[6] }</span>
                        </p>
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">email</i>Dane kontaktowe</legend>
                        <p>
                            <input name="email" type="text" placeholder="E-mail" value={state.email} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[7] }</span>
                        </p>
                        <p>
                            <input name="invoice_email" type="text" placeholder="E-mail do faktur" value={state.invoice_email} onChange={handleInput} />
                            <span className="validation-message">{ this.state.message[8] }</span>
                        </p>
                        <p>
                            <input name="phone" type="text" placeholder="Telefon" value={state.phone} onChange={handleInput} />
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
                        <button type="submit" onClick={this.submit}>Zapisz</button>
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">security</i>Zmień hasło</legend>
                        <p>
                            <input name="password" type="password" placeholder="Hasło" />
                        </p>
                        <p>
                            <input name="confirm_password" type="password" placeholder="Powtórz hasło" />
                        </p>
                        <button type="submit" onClick={this.submit}>Zapisz</button>
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

        this.state = { deliveries: 1 };
        this.addDelivery = this.addDelivery.bind(this);

    }

    addDelivery() {
        const div = document.createElement('div');
        const name = document.createElement('input');
        const price = document.createElement('input');


        name.type = 'text';
        name.name = `delivery_${this.state.deliveries + 1}`;
        name.placeholder = "Nazwa przewoźnika";
        price.type = 'number';
        price.name = name.name;
        price.placeholder = "Cena dostawy";

        div.appendChild(name);
        div.appendChild(price);
        this.deliveriesRef.appendChild(div);

        this.setState(prev => ({ deliveries: prev.deliveries + 1 }));
    }

    submit(event) {
        event.preventDefault();

        const formData = new FormData(this.formRef);
        this.props.postDeliveries(formData);
    }

    render() {
        return (
            <div className="Profile Delivery">
                <ProfileLinks active="auctiondelivery"/>
                {
                    this.props.user === null ? <Progress /> 
                    :
                    (<form ref={ (e) => this.formRef = e } className="user-settings" action="/user/delivery" method="post">
                        <h1>Metody dostawy towaru</h1>
                        <ol>
                            <li>Określ sposoby dostawy sprzedawanych towarów</li> 
                            <li>Podaj ceny, które naliczysz za wysyłkę</li> 
                            <li>Wzbogać listę przewoźników, aby uatrakcyjnić swoją ofetrę</li>
                        </ol>
                        <br /><br />
                        <fieldset>
                            <legend><i className="material-icons">local_shipping</i>Przewoźnicy</legend>
                            <p ref={ (e) => this.deliveriesRef = e } className="deliveries">
                                <div>
                                    <input name="delivery_1" type="text" placeholder="Nazwa przewoźnika"/>
                                    <input name="delivery_1" type="number" placeholder="Cena dostawy" min="1" step="0.01" />
                                </div>
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

Settings = connect(mapUserStateToProps, profileActions)(Settings);
Delivery = connect(mapUserStateToProps, profileActions)(Delivery);

export { ProfileLinks, Settings, CreateUpdateAction, Delivery };