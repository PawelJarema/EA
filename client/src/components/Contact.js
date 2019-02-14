import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as contactActions from '../actions/contactActions';
import Modal from './Modal';

class Contact extends Component {
	send() {
		const formData = new FormData(this.formRef);
		this.props.contactEaukcje(formData);
	}

	render() {
		return (
			<Modal
                open={true}
                title={<span><span className="thin"><i className="material-icons">mail_outline</i></span><div className="title-text"><span className="thin">Pomoc eaukcje.pl</span></div></span>}
                actions={<button className="standard-button" onClick={this.send.bind(this)}><i className="material-icons">mail_outline</i>Wyślij</button>}
                cancel={false}
                close={false}
            >
                <form ref={ (e) => this.formRef = e}>
                    <p style={{ paddingTop: 16, paddingLeft: 30, fontSize: 12 }}>Jeśli masz sugestie, pytania, lub potrzebujesz pomocy, zaloguj się i skontaktuj się z nami:</p>

                    <textarea name="message" placeholder="wpisz wiadomość"></textarea>
                </form>
            </Modal>
		);
	}
}

Contact = connect(null, contactActions)(Contact);
export default Contact;