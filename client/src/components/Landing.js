import React, { Component } from 'react';
import './Landing.css';

class RegistrationLanding extends Component {
    render() {
        return (
            <div className="registration-panel">
                <div className="column">
                    <div className="container">
                        <div className="oauth">
                            <div className="facebook"><img src="/assets/fb.png" /><span>Załóż konto z Facebookiem</span></div>
                            <div className="linkedin"><img src="/assets/in.png" /><span>Załóż konto z Linkedin</span></div>
                        </div>
                        <div className="email">
                            <input name="email" type="email" placeholder="E-mail" />
                            <input name="password" type="password" placeholder="Hasło" />
                            <input name="confirm-password" type="password" placeholder="Powtórz Hasło" />
                        </div>
                        <div className="rodo">
                            <label>
                                <input type="checkbox" />Rodo 1
                                <span className="checkbox-value"></span>
                            </label>
                            <label>
                                <input type="checkbox" />Rodo 2
                                <span className="checkbox-value"></span>
                            </label>
                        </div>
                        <button className="submit">Załóż konto</button>
                    </div>
                </div>
                <div className="column">
                    <div className="container">
                        <h1>Zarejestruj się</h1>
                        <img src="/assets/website.png" />
                    </div>
                </div>
            </div>
        );
    }
};

export { RegistrationLanding };