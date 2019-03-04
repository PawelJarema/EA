import React, { Component } from 'react';

import RawImage from './RawImage';
import { Seller, Deliveries, Opinions } from '../OtherUser';

import sizeMe from 'react-sizeme';
import { IMAGE_ASPECT_RATIO } from './constants';

import PriceHelper from '../../helpers/priceHelper';
import AuctionEndHelper from '../../helpers/auctionEndHelper';
import { getUnits, isBidder, isNotEmpty, pluralize } from './functions';
import { ImageProgress } from '../Progress';

class BigPhoto extends Component {
    constructor(props) {
        super(props);
        this.state = { enlarge: false };
    }

    toggleEnlarge() {
        this.setState(({ enlarge }) => ({ enlarge: !enlarge }));
    }

    render() {
        const { photo, height } = this.props;

        return (
            <div className={"photo-big" + (this.state.enlarge ? ' enlarge' : '')} style={ height ? { height } : null } onClick={ this.toggleEnlarge.bind(this) }>
                <div className="image-wrapper">
                    {
                        photo 
                        ?
                        <RawImage blob={ photo } />
                        :
                        <div><ImageProgress /></div>
                    }
                </div>
            </div>
        );
    }
}

class AuctionPreview extends Component {
    constructor(props) {
        super(props);        
        this.state = { auction: props.auction, photo: 0, views: 0, activeViews: 0 };
        this.seePhoto = this.seePhoto.bind(this);
    }

    seePhoto(index) {
        this.setState(prev => ({ photo: prev.photo <= index ? index + 1 : index }));
    }

    handleTab(event) {
        event.preventDefault();
        const link = event.target;
        const tab = document.getElementById(link.href.split('#')[1]);
        const view_area = tab.parentNode;

        if (link.className.indexOf('active') === -1) {
            let prev = document.querySelectorAll('.tab-view .active');
            for (let i = 0, l = prev.length; i < l; i++) {
                prev[i].className = prev[i].className.replace(/\s*active/g, '');
            }

            link.className += 'active';
            tab.className += 'active';
        }

        tab.scrollIntoView({behavior: 'smooth', block: 'center'});
    }

    render() {
        const { auction, pay } = this.state;
        const { bidders } = auction || { bidders: {} };
        const { user, photos } = this.props;
        const other_user = user;

        if (!user || !auction) return null;

        const active_photo = this.state.photo;
        const thumbnails = photos ? photos.slice(0, active_photo).concat(photos.slice(active_photo + 1)) : null;

        const min_price = auction ? auction.min_price && !auction.hide_min_price : false;
        const buy_now = Boolean(auction.buy_now_price);
        const payee = false;
        const buy_now_payee = false;

        const current_price = auction.current_price || auction.start_price;

        const extended_view = true || window.innerWidth > 1579;
        const iAmBidder = false;

        const 
            viewers = this.state.activeViews,
            personArr = ['osoba', 'osoby', 'osób'];

        const 
            bidStub = (
                <div className="no-result">
                    <i className="material-icons">gavel</i>
                    <h1>{ (auction.ended ? 'Nikt nie zalicytował' : 'Nikt nie licytuje') }</h1>
                    <p>{ (auction.ended ? '' : 'Podbij stawkę minimalną i bądź pierwszy!') }</p> 
                </div>
            ),
            likeStub = <p><span className="like-auction"><i className="material-icons like-icon">favorite</i></span></p>;

        return (
            <div className="AuctionDetails">
                {
                    auction && (
                        <div className="auction-view">
                            <div className="basic-info">
                                <div className="photos">
                                    <BigPhoto photo={ photos[active_photo] } onSize={ (size) => this.setState({ photoHeight: size.width / IMAGE_ASPECT_RATIO }) } height={ this.state.photoHeight }/>
                                    <div className="photos-small">
                                        {
                                            thumbnails && thumbnails.length 
                                            ?
                                            thumbnails.map((thumb, index) => (
                                                <div key={"thumbnail_" + index} className="thumbnail-wrapper" onClick={() => this.seePhoto(index)}>
                                                    <RawImage blob={ thumb } />
                                                </div>
                                            ))
                                            :
                                            null
                                        }
                                    </div>
                                </div>

                                <div className="text">
                                    <div className="content">
                                        <h1>{ auction.title }</h1>
                                        <p>{auction.shortdescription}{ likeStub }</p>
                                        <p className="attribute-tags">
                                            <span className="attribute">Ilość<span>{ auction.quantity }</span></span>
                                            {
                                                isNotEmpty(auction.properties) && auction.properties.map(attr => (
                                                    <span key={`${attr.name}_${attr.value}`} className="attribute">{attr.name}<span>{attr.value}</span></span>
                                                ))
                                            }
                                            {
                                                isNotEmpty(auction.int_properties) && auction.int_properties.map(attr => (
                                                    <span key={`${attr.name}_${attr.value}`} className="attribute">{attr.name}<span>{attr.value} <span className="unit">{ getUnits(attr.name) }</span></span></span>
                                                ))
                                            }
                                        </p>
                                        <span className="auction-views">
                                            <span>Ogłoszenie wyświetla teraz { pluralize(viewers, personArr) }</span>
                                            <span> Aukcję obserwuje { pluralize(auction.likes, personArr) }</span>
                                            <span> Wszystkie wyświetlenia: { this.state.views }</span>
                                        </span>
                                        <div className={ (auction.ended ? 'transparent' : '') }>
                                            <div className="price">Aktualna cena: <span className="value">{ PriceHelper.write(current_price) }</span></div>
                                            { buy_now ? <div className="buy-now"><button className="standard-button" onClick={this.buyNow}>* Kup teraz za <span className="price-value">{ PriceHelper.write(auction.buy_now_price) }</span>!</button></div> : null }
                                            <div><span className="time-span">do końca { AuctionEndHelper({ start_date: Date.now(), duration: auction.duration || 1 }) }</span></div>
                                            { min_price ? <div className="min-price">Cena minimalna: <span className="price-value">{ PriceHelper.write(auction.min_price) }</span><br /><br /><br /></div> : null }
                                            {
                                                auction._user !== user._id && (<span>
                                                    <span className="price-input-wrapper"><input ref={ (e) => this.bidInputRef = e } name="bid" type="number" lang="pl" placeholder="Kwota licytacji" min={auction.current_price + 1} step="5" defaultValue={current_price} /></span>
                                                    <button type="submit" disabled={auction.ended === true}><i className="material-icons">gavel</i>Licytuj</button>
                                                </span>)
                                            }
                                        </div>
                                        {
                                            auction.ended && <div className="end-tag">Aukcja Zakończona</div>
                                        }
                                        {
                                            (payee || buy_now_payee) && <div className="pay"><br />kupiłeś ten przedmiot. <button className="standard-button" onClick={() => this.setState({ pay: true })} style={{ padding: '0 26.5px' }}>Zapłać {payee ? PriceHelper.write(current_price) : PriceHelper.write(auction.buy_now_price)} zł</button></div>
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className="tab-view">
                                <div>
                                <div className="tab-controls">
                                    <a className="active" href="#description" onClick={this.handleTab}>Opis przedmiotu</a>
                                    <a href="#bids" onClick={this.handleTab}>Stan licytacji</a>
                                    <a href="#seller" onClick={this.handleTab}>Sprzedawca</a>
                                    <a href="#opinions" onClick={this.handleTab}>Opinie</a>
                                    <a href="#shipping" onClick={this.handleTab}>Metody dostawy</a>
                                </div>
                                <div className="tab-content-area">
                                    <div id="bids">
                                        { bidStub }
                                        <div className="background">
                                            <i className="material-icons">gavel</i>
                                        </div>
                                    </div>
                                    <div className="active" id="description">
                                        { 
                                            auction.description ? 
                                            <div className="html-description" dangerouslySetInnerHTML={{ __html: auction.description }}></div> 
                                            :
                                            <div className="no-result">
                                                <i className="material-icons">sentiment_dissatisfied</i>
                                                <h1>Brak dodatkowych informacji</h1>
                                                <p>Sprzedawca nie dodał opisu.<br />Zadaj pytanie o przedmiot w zakładce 'Sprzedawca'</p>
                                            </div>
                                        }
                                        <div className="background">
                                            <i className="material-icons">description</i>
                                        </div>
                                    </div>
                                    <div id="opinions">
                                        <Opinions other_user={other_user}/>
                                        <div className="background">
                                            <i className="material-icons">star_outline</i>
                                        </div>
                                    </div>
                                    <div id="seller">
                                        <Seller auction={ auction } user={ user } stub={ user } socket={this.props.socket} showAllData={ iAmBidder } />
                                        <div className="background">
                                            <i className="material-icons">account_circle</i>
                                        </div>
                                    </div>
                                    <div id="shipping">
                                        <Deliveries auction={ auction } />
                                        <div className="background">
                                            <i className="material-icons">local_shipping</i>
                                        </div>
                                    </div>
                                </div>
                                </div>
                                
                                    {   
                                        extended_view && (<div className="extra-tab">
                                             { bidStub }
                                        </div>)
                                    }
                                
                            </div>
                        </div>
                    )
                }
            </div>
        );
    }
}

BigPhoto = sizeMe({ monitorHeight: true })(BigPhoto);;

export default AuctionPreview;