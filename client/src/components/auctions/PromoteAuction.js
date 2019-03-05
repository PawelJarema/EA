import React, { Component } from 'react';
import { ProfileLinks } from '../Profile';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import * as przelewy24Actions from '../../actions/przelewy24Actions';

import { auctionPath } from './functions';
import './PromoteAuction.css';

class PromoteAuction extends Component {
    constructor(props) {
        super(props);

        this.state = { promoCode: 0, promoted: false };

        this.select = this.select.bind(this);
        this.promote = this.promote.bind(this);
    }

    select(e) {
        const
            input = e.target,
            option = input.value;

        this.setState({ promoCode: +option, promoted: Boolean(+option) });
    }

    promote(e) {
        const 
            { auction, tech_break } = this.props,
            { promoCode, promoted } = this.state,
            data = { 
                auction_id: auction._id, 
                auction_title: auction.title, 
                auction_url: auctionPath(auction).slice(1),
                promoCode,
                price: (promoCode === 1 ? (tech_break.premium7daysPrice || 6) : (tech_break.premiumForeverPrice || 12))
            };

        if (promoted) {
            e.preventDefault();
            this.props.promoteAuction(data);
        }
    }

	render() {
        const 
            { user, auction, close, tech_break } = this.props,
            { promoted } = this.state;

		return (
			<div className="Profile Auction PromoteAuction">
                <ProfileLinks active="addauction" />
                <div>
                    {
                        (!auction.premium || !auction.premium.isPremium) ? (
                            <div>
                                <h1>Wypromuj aukcję { auction.title }</h1>
                                <p>Wypromowane ogłoszenia wyświetlane są jako pierwsze w wynikach wyszukiwania, są też publikowane na stronie głównej. Promowanie <b>czterokrotnie</b> zwiększa ilość wyświetleń, zatem każdego dnia zwiększa skuteczność sprzedaży o ok. <b>400%</b>.</p>
                                <form className="promo-form">
                                    <div>
                                        <span><h2 className="heading">Nie, dziękuję</h2></span>
                                        <span className="top subheading">Dodamy twoje ogłoszenie bezpłatnie</span>
                                        <span className="middle price absolute-center">0 zł</span>
                                        <span className="bottom">Rozumiem, ale nie chcę promować mojego ogłoszenia.</span>
                                        <input type="radio" name="promo" value="0" onChange={ this.select }/>
                                        <span className="input-value absolute-center"></span>
                                    </div>
                                    <div>
                                        <span><h2 className="heading">Oferta Premium 7 dni</h2></span>
                                        <span className="top subheading">Twoje ogłoszenie będzie promowane przez 7 dni</span>
                                        <span className="middle price absolute-center">{ tech_break.premium7daysPrice || 6 } zł</span>
                                        <span className="bottom">Chcę optymalnie zwiększyć szansę sprzedaży wszystkich towarów</span>
                                        <input type="radio" name="promo" value="1" onChange={ this.select }/>
                                        <span className="input-value absolute-center"></span>
                                    </div>
                                    <div>
                                        <span><h2 className="heading">Oferta Premium Forever <i className="material-icons hot-orange">whatshot</i></h2></span>
                                        <span className="top subheading">Promocja trwa aż do końca aukcji, w wynikach wyszukiwania aukcja będzie oznaczona znaczkiem jakości</span>
                                        <span className="middle price absolute-center">{ tech_break.premiumForeverPrice || 12 } zł</span>
                                        <span className="bottom">Chcę znacznie podnieść sprzedaż lub potrzebuję sprzedać towar niszowy</span>
                                        <input type="radio" name="promo" value="2" onChange={ this.select } />
                                        <span className="input-value absolute-center"></span>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div>
                                <br />
                            </div>
                        )
                    }
                    <div className="buttons">
                        <button className="standard-button" onClick={ close }>Dodaj następną aukcję</button>
                        <NavLink to={ auctionPath(auction) } onClick={ this.promote }><button className="standard-button">{ (promoted ? 'Wypromuj i przejdź' : 'Przejdź') } do ogłoszenia <i className="material-icons">arrow_forward</i></button></NavLink>
                    </div>
                </div>
            </div>
		);
	}
}

function mapStatesToProps({ tech_break }) {
    return { tech_break };
}

PromoteAuction = connect(mapStatesToProps, przelewy24Actions)(PromoteAuction);

export default PromoteAuction;