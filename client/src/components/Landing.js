import React, { Component } from 'react';
import './Landing.css';
import { connect } from 'react-redux';
import * as authActions from '../actions/authActions';

class RegistrationPanel extends Component {
    render() {
        return (
            <div className={"registration-panel" + (this.props.className ? ` ${this.props.className}` : '')}> 
                <div className="column">
                    <div className="container">
                        { this.props.children }
                    </div>
                </div>
                <div className="column">
                    <div className="container">
                        <h1>{ this.props.title }</h1>
                        <img src="/assets/website.png" />
                    </div>
                </div>
            </div>
        );
    }
}
// `
            
class LoginLanding extends Component {
    render() {
        return (
            <RegistrationPanel title="Zaloguj się" className="login">
                <form action="/auth/login" method="post">
                <div className="email">
                    <input name="email" type="email" placeholder="E-mail" />
                    <input name="password" type="password" placeholder="Hasło" />
                    <span className="options">
                        <span>
                            <label>
                                <input type="checkbox" />Zapamiętaj mnie
                                <span className="checkbox-value"></span>
                            </label>
                        </span>
                        <span>
                            <a href="#">Nie pamiętam hasła</a>
                        </span>
                    </span>
                </div>
                <button className="submit">Zaloguj się</button>
                </form>
            </RegistrationPanel>
        );
    }
}

class RegistrationLanding extends Component {
    constructor(props) {
        super(props);
        
        this.state = { email: '', password: '', confirm_password: '', rodo_1: false, rodo_2: false, messages: [] };
        this.handleInput = this.handleInput.bind(this);
        this.allFieldsValid = this.allFieldsValid.bind(this);
        this.submit = this.submit.bind(this);
    }
    
    componentDidMount() {
        this.props.fetchEmails();
    }
    
    handleInput(event) {
        const target = event.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
 
        this.setState({ [name]: value }, () => this.allFieldsValid());
    }
    
    submit(event) {
        const state = this.state;
        if (this.allFieldsValid()) {
            
        } else {
            let fields = document.querySelectorAll('.message');
            for (let i = 0, l = fields.length; i < l; i++) {
                fields[i].style.display = 'block';
            }
            
            event.preventDefault();
        }
    }
    
    allFieldsValid() {
        let valid = true,
            messages = [],
            email = this.state.email,
            password = this.state.password,
            rodo_1 = this.state.rodo_1,
            rodo_2 = this.state.rodo_2,
            confirm = this.state.confirm_password;
        
        let emailCheck = /.+@.+\.\w{2,}/i;
        let passwordCheck = /.{8,}/;
        
        if (!emailCheck.test(email)) {
            messages[0] = 'wpisz poprawny adres E-mail';
            valid = false;
        }
        
        if (!passwordCheck.test(password)) {
            messages[1] = 'przynajmniej 8 znaków';
            valid = false;
        }
        
        if (!(password === confirm)) {
            messages[2] = 'hasło i potwierdzenie muszą być identyczne'
            valid = false;
        }
        
        if (!(rodo_1 && rodo_2)) {
            messages[3] = 'zaznacz zgody';
            valid = false;
        }
        
        this.setState({ messages });
        
        return valid;
    }
    
    render() {
        return (
            <RegistrationPanel title="Zarejestruj się" className="register">
                <div className="oauth">
                    <a href="/auth/facebook" className="facebook"><img src="/assets/fb.png" /><span>Załóż konto z Facebookiem</span></a>
                    <a href="/auth/linkedin" className="linkedin"><img src="/assets/in.png" /><span>Załóż konto z Linkedin</span></a>
                </div>
                <form action="/auth/email" method="post">
                <div className="email">
                    <span>
                        <input name="email" type="email" placeholder="E-mail" value={this.state.email} onChange={this.handleInput}/>
                        <span className="message">{ this.state.messages[0] }</span>
                    </span>
                    <span>
                        <input name="password" type="password" placeholder="Hasło" value={this.state.password} onChange={this.handleInput}/>
                        <span className="message">{ this.state.messages[1] }</span>
                    </span>
                    <span>
                        <input name="confirm_password" type="password" placeholder="Powtórz Hasło" value={this.state.confirm_password} onChange={this.handleInput}/>
                        <span className="message">{ this.state.messages[2] }</span>
                    </span>
                </div>
                <div className="rodo">
                    <span className="message">{ this.state.messages[3] }</span>
                    <label>
                        <input name="rodo_1" type="checkbox" value={this.state.rodo_1} onChange={this.handleInput}/>Rodo 1
                        <span className="checkbox-value"></span>
                    </label>
                    <label>
                        <input name="rodo_2" type="checkbox" value={this.state.rodo_2} onChange={this.handleInput}/>Rodo 2
                        <span className="checkbox-value"></span>
                    </label>
                </div>
                <button className="submit" onClick={this.submit}>Załóż konto</button>
                </form>
            </ RegistrationPanel>
        );
    }
};

function mapEmailsToProps({ emails }) {
    return { emails };
}
        
RegistrationLanding = connect(mapEmailsToProps, authActions)(RegistrationLanding);

export { RegistrationLanding, LoginLanding };