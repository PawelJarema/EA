import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as auctionActions from '../../actions/auctionActions';
import * as photosActions from '../../actions/photosActions';
import * as otherUserActions from '../../actions/otherUserActions';
import * as viewsActions from '../../actions/viewsActions';

import RawImage from './RawImage';
import Pay from './Pay';
import LikeAuction from './Like';
import AuctionBids from './Bids';
import { Seller, Deliveries, Opinions } from '../OtherUser';
import Progress, { ImageProgress } from '../Progress';

import sizeMe from 'react-sizeme';
import { IMAGE_ASPECT_RATIO } from './constants';

import PriceHelper from '../../helpers/priceHelper';
import AuctionEndHelper from '../../helpers/auctionEndHelper';
import { getUnits, isBidder, isNotEmpty, pluralize } from './functions';

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
                        <RawImage data={ photo } />
                        :
                        <div><ImageProgress /></div>
                    }
                </div>
            </div>
        );
    }
}

class AuctionDetails extends Component {
    constructor(props) {
        super(props);        
        this.state = { auction: '', photo: 0, pay: false, views: 0, activeViews: 0 };
        this.seePhoto = this.seePhoto.bind(this);
        this.buyNow = this.buyNow.bind(this);
        this.submit = this.submit.bind(this);
        this.payCallback = this.payCallback.bind(this);
        this.fetchTotalViews = this.fetchTotalViews.bind(this);
        this.fetchViews = this.fetchViews.bind(this);
    }

    componentDidMount() {
        const auction_id = this.props.match.params.id;

        this.props.clearOtherUser();
        this.props.clearAuction();
        this.props.clearPhotos();
        this.props.fetchAuction(auction_id);
        this.props.fetchPhotos(auction_id);

        this.props.registerView(auction_id)
        .then(() => this.fetchViews(auction_id));
        
        this.props.addView(auction_id) 
        .then(() => this.fetchTotalViews(auction_id));
    }

    fetchTotalViews(auction_id) {
        fetch(`/api/get_total_views/${auction_id}`)
            .then(res => res.json())
            .then(data => this.setState({ views: data.views }));
    }

    fetchViews(auction_id) {
        fetch(`/api/views/${auction_id}`)
            .then(res => res.json())
            .then(data => this.setState({ activeViews: data.viewers }));
    }

    componentWillUnmount() {
        this.props.unregisterView(this.props.match.params.id);
    }

    componentWillReceiveProps(props) {
        if (props.auctions) {
            if (!this.state.auction || String(props.auctions._id) !== String(this.state.auction._id)) {
                this.setState({ auction: props.auctions });
                this.props.fetchOtherUser(props.auctions._user);
            }
        }
        if (props.match.params.id !== this.props.match.params.id) {
            this.setState({ auction: null }, () => this.props.fetchAuction(props.match.params.id));
        }
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

    buyNow() {
        if (!this.props.user) {
            alert('Zaloguj się, aby kupić przedmiot');
            return;
        }
        
        const auction = this.state.auction;
        const reply = window.confirm(`Czy chcesz kupić ${auction.title} za ${auction.price.buy_now_price} zł ?`);
        if (reply) {
            this.props
                .buyNow(auction._id)
                .then(() => { 
                const auction_id = this.props.match.params.id;
                this.props
                    .fetchAuction(auction_id)
                    .then(() => { this.setState({ auction: this.props.auctions }); });
                });
        }
    }

    payCallback() {
        this.setState({ pay: false });
    }

    submit(event) {
        event.preventDefault();

        const user = this.props.user;
        const confirmed = user.firstname && user.lastname && user.address && user.address.street && user.address.postal && user.address.city && user.contact.email;
        const auction = this.state.auction;
        const formData = new FormData(this.formBidRef);
        const bid_value = Number(this.bidInputRef.value);

        if (!user) {
            alert('Aby wziąć udział w licytacji musisz się zalogować');
            return;
        }

        if (!confirmed) {
            alert('Aby wziąć udział w licytacji, musisz uzupełnić swoje dane w ustawieniach');
            return;
        }

        if (!bid_value) {
            alert('Podaj stawkę licytacji');
            return;
        } 
        if (bid_value <= auction.price.current_price || bid_value < auction.price.start_price) {
            alert('Musisz przebić obecną stawkę');
            return;
        }
        if (bid_value > auction.price.current_price + 10 && auction.bids && auction.bids.length && auction.bids[0]._user === String(this.props.user._id)) {
            const reply = window.confirm('Już prowadzisz w licytacji. Napewno chcesz podbić cenę ?');
            if (!reply) return;
        }

        window.scrollTo(0, 0);
        this.props.showSpinner();
        this.props
            .postBid(auction._id, formData)
            .then(() => { 
                const auction_id = this.props.match.params.id;
                this.props
                    .fetchAuction(auction_id)
                    .then(() => { this.setState({ auction: this.props.auctions }); });
                });
    }

    render() {
        const { auction, pay } = this.state;
        const { bidders } = auction || { bidders: {} };
        const { user, other_user, photos, categories } = this.props;

        const active_photo = this.state.photo;
        //const thumbnails = auction ? auction.photos.slice(0, active_photo).concat(auction.photos.slice(active_photo + 1)) : null;
        const thumbnails = photos ? photos.slice(0, active_photo).concat(photos.slice(active_photo + 1)) : null;

        //const buy_now = auction ? !auction.ended && user._id !== auction._user && auction.price.buy_now_price && auction.price.buy_now_price >= auction.price.current_price && auction.bids.filter(bid => bid._user === user._id).length : false;
        const buy_now = auction ? !auction.ended && user._id !== auction._user && auction.price.buy_now_price : false; //&& auction.price.buy_now_price >= auction.price.current_price && auction.bids.filter(bid => bid._user === user._id).length : false;
        const min_price = auction ? !auction.ended && auction.price.min_price && !auction.price.hide_min_price : false;
        const payee = auction ? auction.payees && auction.payees.indexOf(user._id) !== -1 : false;
        const buy_now_payee = auction ? auction.buynowpayees && auction.buynowpayees.indexOf(user._id) !== -1 : false;

        const current_price = auction ? auction.price.current_price || auction.price.start_price : false;

        const extended_view = true || window.innerWidth > 1579;
        const iAmBidder = isBidder(user);
        const isPremium = auction ? auction.premium.isPremium : false;
        const premiumForever = auction ? auction.premium.forever : false;

        const 
            viewers = this.state.activeViews,
            personArr = ['osoba', 'osoby', 'osób'];

        return (
            <div className="AuctionDetails">
                {
                    !auction ? <Progress /> : (
                        <div className="auction-view">
                            {
                                pay && <Pay user={ user } auction={ auction } callback={ this.payCallback } />
                            }
                            <div className="basic-info">
                                <div className="photos">
                                    <BigPhoto photo={ photos[active_photo] } onSize={ (size) => this.setState({ photoHeight: size.width / IMAGE_ASPECT_RATIO }) } height={ this.state.photoHeight }/>
                                    <div className="photos-small">
                                        {
                                            thumbnails && thumbnails.length 
                                            ?
                                            thumbnails.map((thumb, index) => (
                                                <div key={"thumbnail_" + index} className="thumbnail-wrapper" onClick={() => this.seePhoto(index)}>
                                                    <RawImage data={thumb} />
                                                </div>
                                            ))
                                            :
                                            null
                                        }
                                    </div>
                                </div>

                                <div className="text">
                                    <div className="content">
                                        { isPremium && <h1 className="premium-tag">Aukcja PREMIUM</h1> }
                                        <h1>{ auction.title }</h1>
                                        <p>{auction.shortdescription}<LikeAuction user={user} auction={auction} /></p>
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
                                            { buy_now ? <div className="buy-now"><button className="standard-button" onClick={this.buyNow}>* Kup teraz za <span className="price-value">{ PriceHelper.write(auction.price.buy_now_price) }</span>!</button></div> : null }
                                            <div><span className="time-span">do końca { AuctionEndHelper(auction.date) }</span></div>
                                            { min_price ? <div className="min-price">Cena minimalna: <span className="price-value">{ PriceHelper.write(auction.price.min_price) }</span><br /><br /><br /></div> : null }
                                            {
                                                auction._user !== user._id && (<form ref={ (e) => this.formBidRef = e } action="/auction/bid" method="post">
                                                    <span className="price-input-wrapper"><input ref={ (e) => this.bidInputRef = e } name="bid" type="number" lang="pl" placeholder="Kwota licytacji" min={auction.price.current_price + 1} step="5" defaultValue={current_price} /></span>
                                                    <button type="submit" onClick={this.submit} disabled={auction.ended === true}><i className="material-icons">gavel</i>Licytuj</button>
                                                </form>)
                                            }
                                        </div>
                                        {
                                            auction.ended && <div className="end-tag">Aukcja Zakończona</div>
                                        }
                                        {
                                            (payee || buy_now_payee) && <div className="pay"><br />kupiłeś ten przedmiot. <button className="standard-button" onClick={() => this.setState({ pay: true })} style={{ padding: '0 26.5px' }}>Zapłać {payee ? PriceHelper.write(current_price) : PriceHelper.write(auction.price.buy_now_price)} zł</button></div>
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
                                        <AuctionBids user={user} auction={auction} bidders={bidders} />
                                        <div className="background">
                                            <i className="material-icons">gavel</i>
                                        </div>
                                    </div>
                                    <div className="active" id="description">
                                        { 
                                            auction.description && auction.description.length > 20 ? 
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
                                        <Seller auction={ auction } user={user} socket={this.props.socket} showAllData={ iAmBidder } />
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
                                             <AuctionBids user={user} auction={auction} bidders={bidders} />
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

function mapAuctionsPhotosUserAndOtherUserStateToProps({ auctions, photos, user, other_user }) {
    return { auctions, photos, user, other_user };
}

AuctionDetails = connect(mapAuctionsPhotosUserAndOtherUserStateToProps, {...auctionActions, ...photosActions, ...otherUserActions, ...viewsActions})(AuctionDetails);
export default AuctionDetails;