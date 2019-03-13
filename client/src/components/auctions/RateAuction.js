import React, { Component } from 'react';
import Modal from '../Modal';

class RateModal extends Component {
    render() {
        const { title, rateCallback, textCallback, submitCallback, closeCallback, open, text, rate } = this.props
        return (
            <Modal 
                title={ <span><span className="thin"><i className="material-icons">star_outline</i></span><div className="title-text">{ title }</div></span> }
                open={ open }
                close={ closeCallback }
                actions={ <button className="standard-button" type="submit" onClick={ submitCallback }><i className="material-icons">star_outline</i>Dodaj opinię</button> }
            >
                <textarea value={text} placeholder="Wystaw opinię" onChange={ textCallback }/>
                <span className="rate-user">
                    Wystaw notę: 
                    {
                        [1,2,3,4,5].map(i => <i key={'rate_' + i} className="material-icons orange" onClick={ () => rateCallback(i) }>{ i <= rate ? 'star' : 'star_outline' }</i>)
                    }
                </span>

            </Modal>
        );
    }
}

class RateAuction extends Component {
    constructor(props) {
        super(props);
        this.state = { modal: false, text: '', rate: 0 };

        this.toggleModal = this.toggleModal.bind(this);
        this.rate = this.rate.bind(this);
    }

    toggleModal() {
        this.setState(prev => ({ modal: !prev.modal }));
    }

    rate() {
        const { auction, clickHandler } = this.props;
        const { text, rate } = this.state;

        if (!text) {
            alert('Wystaw opinię i wybierz ilość gwiazdek');
            return;
        }

        if (!rate) {
            alert('Wybierz ilość gwiazdek');
            return;
        }
        
        const data = {
            date: new Date().getTime(),
            _auction: auction._id,
            _user: auction._user,
            isseller: true,
            isbuyer: false,
            auction: auction.title,
            rate,
            text
        };

        clickHandler(data);
        this.toggleModal();
    }

    render() {
        const { modal, rate, text } = this.state;
        const { auction } = this.props;

        return (
            <span className="rate-auction">
                <a className="link-button" onClick={this.toggleModal}><i className="material-icons orange">star_outline</i>Wystaw opinię</a>
                {
                    modal && <RateModal 
                        title={ <span><span className="thin">Wystaw opinię sprzedawcy: </span> {auction.title}</span> }
                        rateCallback={ (i) => this.setState({ rate: i }) }
                        textCallback={ (e) => this.setState({ text: e.target.value }) }
                        submitCallback={ this.rate } 
                        closeCallback={ this.toggleModal }
                        open={ modal } 
                        text={ text }
                        rate={ rate } />
                }
            </span>
        );
    }
}

export { RateModal };
export default RateAuction;