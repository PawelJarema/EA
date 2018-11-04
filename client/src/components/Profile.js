import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Profile.css';

import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import { CreateUpdateAction } from './Auctions';

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
        return (
            <div className="links">
                <a href="#">Ustawienia konta</a>
                <a href="#">Aukcje</a>
                <div className="dropdown">
                    <a href="/konto/aukcje/dodaj">Dodaj nową</a>
                    <a href="#">Bieżące</a>
                    <a href="#">Zakończone</a>
                </div>
                <a href="#">Wiadomości</a>
                <a href="#">Saldo</a>
            </div>
        );
    }
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = { birthdate: moment() };
        this.handleInput = this.handleInput.bind(this);
        this.handleDate = this.handleDate.bind(this);
    }
    
    componentWillReceiveProps(props) {
        const user = this.props.user;
        
        if (user !== null && user !== false) {
            this.setState(userToState(user));
        }
    }
    
    handleInput(event) {
        const input = event.target;
        const name = input.name;
        const type = input.type;
        const value = type === 'checkbox' ? input.checked : input.value;
        
        this.setState({ [name]: value });
    }
    
    handleDate(date) {
        this.setState({ birthdate: date });
    }
    
    render() {
        const state = this.state;
        const handleInput = this.handleInput;
        
        return (
            <div className="Profile ProfileSettings">
                <ProfileLinks />
                <form className="user-settings" action="/user/update" method="post">
                    <h1>Ustawienia konta</h1>
                    <fieldset>
                        <legend><i className="material-icons">account_circle</i>Dane osobowe</legend>
                        <p>
                            <input name="firstname" type="text" placeholder="Imię" value={state.firstname} onChange={handleInput}/>
                        </p>
                        <p>
                            <input name="lastname" type="text" placeholder="Nazwisko" value={state.lastname} onChange={handleInput} />
                        </p>
                        <p>
                            <input name="street" type="text" placeholder="Adres" value={state.street} onChange={handleInput} />
                        </p>
                        <p>
                            <input name="postal" type="text" placeholder="Kod pocztowy" value={state.postal} onChange={handleInput} />
                            <input name="city" type="text" placeholder="Miasto" value={state.city} onChange={handleInput} />
                        </p>
                        <p>
                            <span>
                                <div className="label">Data urodzenia</div>
                                <DatePicker dateFormat="DD/MM/YYYY" locale="pl" selected={this.state.birthdate} onChange={this.handleDate} showYearDropdown dropdownMode="select" />
                                <input name="birthdate" type="hidden" value={ this.state.birthdate.valueOf() } />
                            </span>
                        </p>
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">account_balance</i>Numer konta</legend>
                        <p>
                            <input name="account_number" type="text" placeholder="Numer konta bankowego" value={state.account_number} onChange={handleInput} />
                        </p>
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">email</i>Dane kontaktowe</legend>
                        <p>
                            <input name="email" type="text" placeholder="E-mail" value={state.email} onChange={handleInput} />
                        </p>
                        <p>
                            <input name="invoice_email" type="text" placeholder="E-mail do faktur" value={state.invoice_email} onChange={handleInput} />
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
                        <button type="submit">Zapisz</button>
                    </fieldset>
                    <fieldset>
                        <legend><i className="material-icons">security</i>Zmień hasło</legend>
                        <p>
                            <input name="password" type="password" placeholder="Hasło" />
                        </p>
                        <p>
                            <input name="confirm_password" type="password" placeholder="Powtórz hasło" />
                        </p>
                        <button type="submit">Zapisz</button>
                    </fieldset>
                    
                    <fieldset>
                        <legend><i className="material-icons">delete</i>Usuwanie konta</legend>
                        <p className="label text">Usunięcie konta jest nieodwracalne. W wyniku tej operacji wszystkie dane zostaną utracone.</p>
                        <form action="/user/destroy" method="post">
                            <button type="submit" className="destroy">Usuń konto</button>
                        </form>
                    </fieldset>
                </form>
            </div>
        );   
    }
}

function mapUserStateToProps({ user }) {
    return { user };
}

Settings = connect(mapUserStateToProps)(Settings);

export { ProfileLinks, Settings, CreateUpdateAction };