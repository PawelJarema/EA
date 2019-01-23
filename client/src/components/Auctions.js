import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as auctionActions from '../actions/auctionActions';
import * as myAuctionActions from '../actions/myAuctionActions';
import * as photosActions from '../actions/photosActions';
import * as profileActions from '../actions/profileActions';
import * as otherUserActions from '../actions/otherUserActions';
import * as przelewy24Actions from '../actions/przelewy24Actions';
import * as importExportActions from '../actions/importExportActions';

import './Auctions.css';

import { Link } from 'react-router-dom';
import { Pagination } from './Pagination';
import { ProfileLinks } from './Profile';
import { Seller, Deliveries, Opinions } from './OtherUser';
import { ImageProgress } from './Progress';

import Dropzone from 'react-dropzone';
import RichTextEditor from 'react-rte';
import Modal from './Modal';

import NameHelper from '../helpers/nameHelper';
import PriceHelper from '../helpers/priceHelper';
import AuctionEndHelper from '../helpers/auctionEndHelper';

import Progress from './Progress';
import b64toBlob from 'b64-to-blob';

function userName(user) {
    return `${user.firstname} ${user.lastname}`.trim() || 'Anonim';
}

function applyToAuctions(funct) {
    const auctions = document.querySelectorAll('.AuctionList .auction');
    for (let i = 0; i < auctions.length; i++) {
        funct(auctions[i]);
    }
}

function auctionPath(auction) {
    const title = 
        auction.title.toLowerCase()
        .replace(/[żź]/g, 'z')
        .replace(/ć/g, 'c')
        .replace(/ń/g, 'n')
        .replace(/ę/g, 'e')
        .replace(/ą/g, 'a')
        .replace(/ś/g, 's')
        .replace(/ł/g, 'l')
        .replace(/ć/g, 'c')
        .replace(/ó/g, 'o')
        .replace(/[^a-zA-Z\d\s:]/g, '')
        .split(/\s/).join('-')
        .replace(/-{2,}/, '-');
        
    return `/aukcje/${title}/${auction._id}`;
}

class FilteredList extends Component {
    componentWillReceiveProps(props) {
        if (props.auctions) {
            if (typeof props.auctions[props.auctions.length - 1] === 'number') {
                this.props.setPages(props.auctions.pop());
                applyToAuctions(auction => auction.style.opacity = 1);
            }
        }
    }

    render() {
        const { user, page, pages, setPage } = this.props,
            auctions = this.props.auctions;

        return (
            <div className="Filtered AuctionList">
                {
                    pages > 1 && auctions.length > 2 && <Pagination page={page} pages={pages} clickHandler={setPage}/>
                }
                { 
                    (auctions === null || auctions && !auctions.map)
                    ?
                    <Progress />
                    :
                    (auctions === false || auctions.length === 0)
                    ?
                    (
                        <div className="no-result">
                            <div>
                                <i className="material-icons">folder_open</i>
                                <h1>Nic nie znalazłem.</h1>
                                <p>Skorzystaj z wyszukiwania zaawansowanego<br /> albo spróbuj pnownie za jakiś czas.</p>
                            </div>
                        </div>
                    )
                    :
                    auctions.map((auction, i) => {
                        return (
                            <div key={ auction.title + '_' + i } className="auction">
                                <div className="image-wrapper">
                                    {
                                        auction.photos ? <Link to={auctionPath(auction)}><RawImage data={auction.photos[0]} /></Link> : <div className="no-image"></div>
                                    }
                                </div>
                                <div className="text">
                                    <Link to={auctionPath(auction)}><h3>{ auction.title }</h3></Link>
                                    <div className="short-description">{auction.shortdescription}</div>
                                    <p><span className="price">Aktualna cena:</span> <span className="value">{ PriceHelper.write(auction.price.current_price || auction.price.start_price) }</span></p>
                                    <div><span className="time-span">do końca { AuctionEndHelper(auction.date) }</span></div>
                                    <div className="actions">
                                        <div>
                                            <Link to={auctionPath(auction)}><button className="standard-button">Zobacz</button></Link>
                                            <Link to={auctionPath(auction)}><button>Licytuj</button></Link>
                                            <LikeAuction user={user} auction={auction} />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        )
                    })
                }
                {
                    pages > 1 && <Pagination page={page} pages={pages} clickHandler={setPage}/>
                }
            </div>
        );
    }
}


class AuctionBids extends Component {
    render() {
        const { user, auction, bidders } = this.props;
        const current_price = auction.price.current_price || auction.price.start_price;
        return (
            <div className="auction-bids">
                {  
                    auction.bids.length ? (
                        <div className="all-bids">
                            <h1><i className="material-icons">gavel</i> Stan licytacji</h1>
                            <table>
                            <tbody>
                                {
                                    auction.bids.map((bid, index) => {
                                        if (bidders[bid._user]) {
                                            return (
                                                <tr 
                                                    key={'bid_' + index} 
                                                    className={`bidder ${bidders[bid._user]._id === user._id ? 'me' : ''}`}
                                                >
                                                    <td>{ index + 1 }.</td>
                                                    <td>{bidders[bid._user]._id === user._id ? NameHelper.name(bidders[bid._user]) : NameHelper.covername(bidders[bid._user])}</td>
                                                    <td className="price">{ (index === 0 ? PriceHelper.write(current_price) : PriceHelper.write(bid.price)) }</td>
                                                </tr>
                                            );
                                        } else {
                                            return (
                                                <tr key={'bid_' + index}>
                                                    <td>{ index + 1 }</td>
                                                    <td>..............</td>
                                                    <td className="price">{ (index === 0 ? PriceHelper.write(current_price) : PriceHelper.write(bid.price)) }</td>
                                                </tr>
                                            );
                                        }
                                        
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    ) 
                    : 
                    (
                        <div className="no-result">
                            <i className="material-icons">gavel</i>
                            <h1>{ (auction.ended ? 'Nikt nie zalicytował' : 'Nikt nie licytuje') }</h1>
                            <p>{ (auction.ended ? '' : 'Podbij stawkę minimalną i bądź pierwszy!') }</p> 
                        </div>
                    )
                }
            </div>
        )
    }
}

class LikeAuction extends Component {
    render() {
        const { user, auction } = this.props;
        return (
            <span className="like-auction">
                { 
                    user && !auction.ended && (
                        <i className="material-icons like-icon" 
                            onClick={ 
                                (e) => { 
                                    if (e.target.innerHTML.indexOf('outline') !== -1) {
                                        e.target.innerHTML = 'favorite';
                                        this.props.likeAuction(auction._id, true);
                                    } else {
                                        e.target.innerHTML = 'favorite_outline';
                                        this.props.likeAuction(auction._id, false);
                                    }
                                }
                            }
                        >
                            { auction.liked ? 'favorite' : 'favorite_outline' }
                        </i>
                    )
                }
            </span>
        );
    }
}

class BuyCredits extends Component {
    constructor(props) {
        super(props);

        this.state = { qty: 1 };
        this.pay = this.pay.bind(this);
    }

    pay() {
        const { qty } = this.state;
        const cost = this.props.tech_break.provision;
        this.props.buyCredits({ qty, cost });
    }

    render() {
        const cost = this.props.tech_break.provision;
        const { qty } = this.state;

        return (
            <Modal
                open={true}
                title={<span><span className="thin"><i className="material-icons">payment</i></span><div className="title-text"><span className="thin">Wyczerpałeś kredyty na poczet aukcji </span></div></span>}
                actions={<button className="standard-button" onClick={this.pay}><i className="material-icons">payment</i>Zakup</button>}
                cancel={false}
                close={false}
            >
                <form ref={ (e) => this.formRef = e}>
                    <p>Koszt zamieszczenia 1 aukcji: <b>{ cost } zł</b></p>
                    <p><input type="range" max={99} min={1} value={qty} onChange={ (e) => this.setState({ qty: e.target.value })}/></p> 
                    <p>Zakup kredyty dla { qty } aukcji. Razem: <b>{ qty * cost } zł</b></p>
                </form>
            </Modal>
        )
    }
}

class Pay extends Component {
    constructor(props) {
        super(props);

        this.getPriceAndQty = this.getPriceAndQty.bind(this);
        this.pay = this.pay.bind(this);

        // paySimple: when no P24 Passage methods
        this.state = { ...(this.getPriceAndQty()), delivery_price: 0, delivery_method: '', paySimple: true }; 
    }

    getPriceAndQty() {
        const { auction, user } = this.props;
        const bought_now = auction.buynowpayees && auction.buynowpayees.indexOf(user._id) !== -1;
        const qty = bought_now ? auction.buynowpayees.filter(id => id === user._id).length : 1;
        const price = bought_now ? auction.price.buy_now_price * qty : auction.price.current_price;

        return { price, qty };
    }

    componentDidMount() {
        const { _user } = this.props.auction;
        this.props.fetchOtherUser(_user);
    }

    pay() {
        const { auction, user } = this.props;
        const { paySimple, price, qty, delivery_price, delivery_method } = this.state;

        if (!delivery_method) {
            alert('Wybierz metodę dostawy');
            return;
        }

        const data = {
            paySimple, 
            title: auction.title,
            price,
            shipping_price: delivery_price,
            shipping_method: delivery_method,
            qty,
            owner_id: auction._user,
            auction_id: auction._id
        };

        this.props.registerP24Transaction(data);
    }


    render() {
        const paySimple = this.state; // no P24 Passage account

        const { price, delivery_price, qty } = this.state;
        const { user, other_user, auction, callback } = this.props;

        if (other_user) {
            return (
                <div className="Pay">
                    <Modal
                        open={true}
                        title={<span><span className="thin"><i className="material-icons">payment</i></span><div className="title-text"><span className="thin">Zapłać za: </span> {auction.title} </div></span>}
                        actions={<button className="standard-button" onClick={this.pay}><i className="material-icons">payment</i>{ (paySimple ? 'Oznacz jako opłacone' : 'Zapłać') }</button>}
                        close={callback}
                    >
                        <form ref={ (e) => this.payformRef = e }>
                            <b>Zakupiłeś { qty } szt.</b> Wybierz metodę dostawy:
                            <table>
                            <tbody>
                            {
                                other_user.deliveries.map((delivery, index) => (
                                    <tr>
                                        <td>
                                            <input key={'delivery_' + index} name="delivery" type="radio" value={1} onChange={() => this.setState({ delivery_price: delivery.price, delivery_method: delivery.name })} />
                                        </td>
                                        <td>
                                            {delivery.name}
                                        </td>
                                        <td>
                                            {delivery.price} zł
                                        </td>
                                    </tr>
                                ))
                            }
                            </tbody>
                            </table>
                        </form>

                        <h1>Do zapłaty: { price + delivery_price } zł</h1>
                        {
                            paySimple && (<p>
                                <br/>Wykonaj teraz przelew na konto Sprzedawcy: 
                                <br/><br/>
                                <b>{ userName(other_user) } { other_user.firm ? other_user.firm.firm_name : '' }</b>
                                <br/>
                                <b>{ other_user.balance.account_number }</b>
                                <br/><br/>
                                Następnie oznacz aukcję jako opłaconą.
                            </p>)
                        }
                    </Modal>
                </div>
            );
        } else {
            return null;
        }
    }
}

class Auction extends Component {
    render() {
        const { auction } = this.props;
        if (!auction)
            return null;

        const current_price = auction.price.current_price || auction.price.start_price;

        return (
            <Link to={auctionPath(auction)}>
                <div className="auction">
                    <div className="photo">
                        <ImageProgress />
                        {
                            <RawImage link={auction} />
                        }
                    </div>
                    <div className="title">
                        <h2>{auction.title}</h2>
                    </div>
                    <div className="description">
                        <p>{auction.shortdescription}</p>
                    </div>
                    <div className="price-div">
                        <span className="price">Aktualna cena: <span className="value">{ PriceHelper.write(current_price) }</span></span>
                    </div>
                </div>
            </Link>
        );
    }
}

class FrontPage extends Component {

    componentDidMount() {
        this.props.fetchFrontPageAuctions();
    }

    componentWillReceiveProps(props) {
        if (props.auctions) {
        }
    }

    render() {
        return (
            <div className="FrontPage">
                <div className="introduction">
                    
                </div>
                {
                    (!this.props.auctions || !this.props.auctions.popular) && <Progress />
                }
                {
                    this.props.auctions && this.props.auctions.popular && (
                        <div className="most-popular">
                            <h1><i className="material-icons">trending_up</i> Popularne</h1>
                            <div className="two-third-column">
                                <div className="column">
                                    <Auction auction={this.props.auctions.popular[0]} />
                                 </div>
                                <div className="column">
                                    <Auction auction={this.props.auctions.popular[1]} />
                                </div>
                            </div>
                            <div className="six-column">
                                {
                                    this.props.auctions.popular.slice(2).map((auction, index) => <div key={auction.title + index} className="column"><Auction auction={auction} /></div>)
                                }
                            </div>
                        </div>
                    )
                }
                
                {
                    this.props.auctions && this.props.auctions.newest && (
                        <div className="new">
                            <h1><i className="material-icons">new_releases</i> Najnowsze</h1>
                            <div className="three-column">
                                <div className="column">
                                    <Auction auction={this.props.auctions.newest[0]} />
                                </div>
                                <div className="column">
                                    <Auction auction={this.props.auctions.newest[1]} />
                                </div>
                                <div className="column">
                                    <Auction auction={this.props.auctions.newest[2]} />
                                </div>
                            </div>
                            <div className="six-column">
                                {
                                    this.props.auctions.newest.slice(3).map((auction, index) => <div key={auction.title + index} className="column"><Auction auction={auction} /></div>)
                                }
                            </div>
                        </div>
                    )
                }

            </div>
        )
    }
}

class RawImage extends Component {
    componentDidMount() {
        setTimeout(() => { if (this.imgRef) this.imgRef.style.opacity = 1; } , 310);
    }

    render() {
        const { data, link } = this.props;
        if (data) {
            return <div ref={(e) => this.imgRef = e} className="absolute-center div-image-block" style={{ borderStyle: 'none', backgroundImage: `url(data:${data.type || 'image/jpeg'};base64,${data.data})` }}></div>;
        } else if (link) {
            return <div ref={(e) => this.imgRef = e} className="absolute-center div-image-block" style={{ borderStyle: 'none', backgroundImage: `url(/auction/${link._id}/photo)` }}></div>;
        }
    }
}

class AuctionDetails extends Component {
    constructor(props) {
        super(props);        
        this.state = { auction: '', photo: 0, pay: false };
        this.seePhoto = this.seePhoto.bind(this);
        this.buyNow = this.buyNow.bind(this);
        this.submit = this.submit.bind(this);
        this.payCallback = this.payCallback.bind(this);
    }

    componentDidMount() {
        const auction_id = this.props.match.params.id;

        this.props.clearOtherUser();
        this.props.clearAuction();
        this.props.clearPhotos();
        this.props.fetchAuction(auction_id);
        this.props.fetchPhotos(auction_id);
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
        const { user, other_user, photos } = this.props;

        const active_photo = this.state.photo;
        //const thumbnails = auction ? auction.photos.slice(0, active_photo).concat(auction.photos.slice(active_photo + 1)) : null;
        const thumbnails = photos ? photos.slice(0, active_photo).concat(photos.slice(active_photo + 1)) : null;

        const buy_now = auction ? !auction.ended && user._id !== auction._user && auction.price.buy_now_price && auction.price.buy_now_price >= auction.price.current_price && auction.bids.filter(bid => bid._user === user._id).length : false;
        const min_price = auction ? !auction.ended && auction.price.min_price && !auction.price.hide_min_price : false;
        const payee = auction ? auction.payees && auction.payees.indexOf(user._id) !== -1 : false;
        const buy_now_payee = auction ? auction.buynowpayees && auction.buynowpayees.indexOf(user._id) !== -1 : false;

        const current_price = auction ? auction.price.current_price || auction.price.start_price : false;

        const extended_view = true || window.innerWidth > 1579;

        console.log(auction);

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
                                    <div className="photo-big">
                                        <div className="image-wrapper">
                                            {
                                                photos.length 
                                                ?
                                                <RawImage data={photos[active_photo]} />
                                                :
                                                <div><ImageProgress /></div>
                                            }
                                        </div>
                                    </div>
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
                                        <h1>{ auction.title }</h1>
                                        <p>{auction.shortdescription}<LikeAuction user={user} auction={auction} /></p>
                                        <p className="attribute-tags">
                                            <span className="attribute">Ilość<span>{ auction.quantity }</span></span>
                                            {
                                                auction.attributes.map(attr => (
                                                    <span key={`${attr.name}_${attr.value}`} className="attribute">{attr.name}<span>{attr.value}</span></span>
                                                ))
                                            }
                                        </p> 
                                        <div className={ (auction.ended ? 'transparent' : '') }>
                                            <div className="price">Aktualna cena: <span className="value">{ PriceHelper.write(current_price) }</span></div>
                                            { buy_now ? <div className="buy-now"><button className="standard-button" onClick={this.buyNow}>* Kup teraz za <span className="price-value">{ PriceHelper.write(auction.price.buy_now_price) }</span>!</button></div> : null }
                                            <div><span className="time-span">do końca { AuctionEndHelper(auction.date) }</span></div>
                                            { min_price ? <div className="min-price">Cena minimalna: <span className="price-value">{ PriceHelper.write(auction.price.min_price) }</span><br /><br /><br /></div> : null }
                                            {
                                                auction._user !== user._id && (<form ref={ (e) => this.formBidRef = e } action="/auction/bid" method="post">
                                                    <input ref={ (e) => this.bidInputRef = e } name="bid" type="number" lang="pl" placeholder="Kwota licytacji" min={auction.price.current_price + 1} step="5" defaultValue={current_price} />
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
                                        <Seller auction={ auction } user={user} socket={this.props.socket} />
                                        <div className="background">
                                            <i className="material-icons">account_circle</i>
                                        </div>
                                    </div>
                                    <div id="shipping">
                                        <Deliveries />
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
                    modal && (
                        <Modal 
                            title={ <span><span className="thin"><i className="material-icons">star_outline</i></span><div className="title-text"><span className="thin">Wystaw opinię sprzedawcy: </span> {auction.title} </div></span> }
                            open={ modal }
                            close={ this.toggleModal }
                            actions={ <button className="standard-button" type="submit" onClick={this.rate}><i className="material-icons">star_outline</i>Dodaj opinię</button> }
                        >
                            <textarea value={text} placeholder="Wystaw opinię" onChange={ (e) => this.setState({ text: e.target.value }) }/>
                            <span className="rate-user">
                                Wystaw notę: 
                                {
                                    [1,2,3,4,5].map(i => <i key={'rate_' + i} className="material-icons orange" onClick={ () => this.setState({ rate: i }) }>{ i <= rate ? 'star' : 'star_outline' }</i>)
                                }
                            </span>

                        </Modal>
                    )
                }
            </span>
        );
    }
}

class MyAuctionList extends Component {
    constructor(props) {
        super(props);
        this.state = { page: 1, per_page: 10, pages: 1, pay: false };
        this.paginate = this.paginate.bind(this);
        this.paginateTo = this.paginateTo.bind(this);
        this.rateAuction = this.rateAuction.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
        this.pingPrzelewy24 = this.pingPrzelewy24.bind(this);
        this.p24TransactionTest = this.p24TransactionTest.bind(this);
        this.payCallback = this.payCallback.bind(this);
        this.exportAuction = this.exportAuction.bind(this);
        this.importAuction = this.importAuction.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.my_auctions) {
            if (typeof props.my_auctions[props.my_auctions.length - 1] === 'number') {
                applyToAuctions(auction => auction.style.opacity = 1)
                this.setState(prev => ({ pages: Math.ceil(props.my_auctions.pop() / prev.per_page) }));
            }
        }
        if (props.exported) {
            var element = document.createElement('a');
            var file = new Blob([props.exported], { type: 'text/xml' });
            element.href = URL.createObjectURL(file);
            element.download = 'auction.xml';

            this.props.clearExported();
            element.click();
        }
    }

    paginate(page, per_page) {
        const { mode } = this.props;
        applyToAuctions(auction => auction.style.opacity = 0.8);

        switch (mode) {
            case 'current_auctions':
                this.props.paginate(page, per_page);
                break;
            case 'ended_auctions':
                this.props.paginateEnded(page, per_page);
                break;
            case 'current_bids':
                this.props.paginateBids(page, per_page);
                break;
            case 'ended_bids':
                this.props.paginateEndedBids(page, per_page);
                break;
            case 'liked':
                this.props.paginateLikedBids(page, per_page);
                break;
            default:
                alert('unknown mode');
        }
    }

    componentDidMount() {
        const { mode, page, per_page } = this.state;
        this.props.clearPagination();
        this.paginate(page, per_page);
    }

    paginateTo(page) {
        const { per_page } = this.state;
        this.setState(prev => ({ page }), 
            () => this.paginate(page, per_page)
        );
    }

    rateAuction(data) {
        this.props
            .rateAuction(data)
            .then(() => { this.paginateTo(this.state.page || 1) });
    }

    pingPrzelewy24() {
        this.props.pingPrzelewy24();
    }

    p24TransactionTest() {
        this.props.registerP24Transaction();
    }

    confirmDelete(auction) {
        if (auction.bids && auction.bids.length > 0) {
            alert('Nie możesz usunąć aukcji, w której ktoś wziął udział');
            return;
        }

        const confirm = window.confirm('Napewno usunąć tę aukcję ? Operacji nie da się odwrócić');
        if (confirm) {
            const { page, per_page } = this.state;
            this.props.deleteAuctionThenFetchMyAuctions(auction._id, page, per_page);
        }        
    }

    payCallback() {
        this.setState({ pay: false }, () => { this.paginateTo(this.state.page || 1) });
    }

    exportAuction(id) {
        this.props.exportAuction(id);
    }

    importAuction() {
        const formData = new FormData(this.importFormRef);
        this.props
            .importAuction(formData)
            .then(
                () => { this.paginateTo(this.state.pages || 1) }
            );
    }

    render() {
        const { user, my_auctions } = this.props;
        const { page, per_page, pages, pay } = this.state;
        const { mode } = this.props;

        return (
            <div className="Profile MyAuctions">
                <ProfileLinks active={mode} />
                <div className="AuctionList">
                    {
                        mode === 'current_auctions' && (
                            <form className="file-form" ref={(e) => this.importFormRef = e}>
                                <input name="xml" type="file" onChange={this.importAuction}/>
                                <span className="file-value"><button className="standard-button"><i className="material-icons">import_export</i> Importuj aukcję</button></span>
                            </form>
                        )
                    }

                    {
                        pay && <Pay user={ user } auction={ pay } callback={ this.payCallback } />
                    }
                    
                    {
                        pages > 1 && my_auctions.length > 2 && <Pagination page={page} pages={pages} clickHandler={this.paginateTo} />
                    }
                    {
                        my_auctions === 'empty' && <Progress />
                    }
                    {
                        my_auctions && my_auctions != 'empty' && my_auctions.length > 0 && my_auctions.map((auction, index) => (
                            <div key={'my_auction_' + index} className="auction">
                                <div className="image-wrapper">
                                    { auction.photos.length ? <Link to={auctionPath(auction)}><RawImage data={auction.photos[0]} /></Link> : <div className="no-image"/> }
                                </div>
                                 <div className="text">
                                    <Link to={auctionPath(auction)}><h3>{ auction.title }</h3></Link>
                                    <div className="short-description">{auction.shortdescription}</div>
                                    <p><span className="price">Aktualna cena:</span> <span className="value">{ PriceHelper.write(auction.price.current_price || auction.price.start_price) }</span></p>
                                    {
                                       !auction.ended ? (<p className="time-details">
                                            <i className="material-icons">access_alarm</i>
                                            <span className="time-state"> 
                                                do końca { AuctionEndHelper(auction.date) }
                                                <br />
                                                <span className="bidders-state">{ (auction.bids && auction.bids.length ? `licytujący: ${auction.bids.length}` : 'nie licytowano') }</span>
                                            </span>
                                        </p>) : <span className="bidders-state">zakończona</span>
                                    }
                                    <div className="actions dont-hide">
                                        <div>
                                            <Link to={auctionPath(auction)}><button className="standard-button">Zobacz</button></Link>
                                            {
                                                mode === 'ended_bids' && auction.raters && auction.raters.indexOf(user._id) !== -1 && <RateAuction auction={auction} clickHandler={this.rateAuction} />
                                            }
                                            {
                                                mode === 'current_auctions' && <a className="link-button danger" onClick={() => this.confirmDelete(auction)}><i className="material-icons">delete_forever</i>Usuń</a>
                                            }
                                            {
                                                mode === 'current_auctions' && <Link to={auctionPath(auction).replace('aukcje', 'edytuj-aukcje')}><i className="material-icons" style={{ fontSize: 20, margin: '0 6px' }} title='Edytuj'>edit</i></Link>
                                            }
                                            {
                                                mode.indexOf('auction') !== -1 && <i className="material-icons" onClick={() => this.exportAuction(auction._id)} title='Export aukcji'>import_export</i>
                                            }
                                            {
                                                (auction.payees && auction.payees.indexOf(user._id) !== -1 || auction.buynowpayees && auction.buynowpayees.indexOf(user._id) !== -1) && (
                                                    <a className="link-button" onClick={() => this.setState({ pay: auction })}><i className="material-icons">payment</i>Zapłać</a>
                                                )
                                            }
                                            {
                                                mode === 'liked' && (
                                                    <i className="material-icons like-icon" 
                                                        onClick={ 
                                                            (e) => { 
                                                                if (e.target.innerHTML.indexOf('outline') !== -1) {
                                                                    e.target.innerHTML = 'favorite';
                                                                    this.props.likeAuction(auction._id, true);
                                                                } else {
                                                                    e.target.innerHTML = 'favorite_outline';
                                                                    this.props.likeAuction(auction._id, false);
                                                                }
                                                            }
                                                        }
                                                        title='Export aukcji'
                                                    >
                                                        favorite
                                                    </i>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {
                        my_auctions === false && (
                            <div className="no-result">
                                <div>
                                    <i className="material-icons">folder_open</i>
                                    <h1>Nic tu nie ma</h1>
                                    <p>
                                        { 
                                            mode.indexOf('auction') !== -1 
                                            ?  
                                            mode === 'ended_auctions' ? 'Żadna z twoich aukcji jeszcze się nie zakończyła' : 'Nie masz bieżących aukcji. Dodaj nową!' 
                                            :
                                            mode === 'ended_bids' ? 'Żadna z aukcji w których bierzesz udział nie zakończyła się' 
                                            : 
                                            (mode === 'liked' ? 'Polub więcej przedmiotów' : 'Nie bierzesz udziału w żadnych aukcjach. Zalicytuj!')
                                        }
                                    </p>
                                </div>
                            </div>
                        )
                    }
                    {
                        pages > 1 && <Pagination page={page} pages={pages} clickHandler={this.paginateTo} />
                    }
                </div>
            </div>
        );
    }
}

class AuctionList extends Component {
    constructor(props) {
        super(props);
        this.state = { auctions: [] };
        this.page = 1;
        this.pages = 1;
        this.auctions_per_page = 10;
        this.query = null;

        this.paginateTo = this.paginateTo.bind(this);
        this.no_result = false;

        this.getQuery = (props) => {
            const propz = props || this.props;
            if (Object.keys(propz.match.params).length) {
                const params = propz.match.params;
                const category = params.category;
                const query = params.query;

                const min = params.min;
                const max = params.max;
                const state = params.state;
                const sort = params.sort;


                if (!this.query || category != this.query.category || query != this.query.query || this.query.min != min || this.query.max != max || this.query.state != state || this.query.sort != sort ) {
                    this.query = { category, query, min, max, state, sort };
                    return true;
                }
            } else {
                this.query = null
            }

            return false;
        }

        this.getQuery = this.getQuery.bind(this);
        this.getQuery();
    }
    
    componentDidMount() {     
        this.props.paginate(1, this.auctions_per_page, this.query);
    }
    
    componentWillReceiveProps(props) {
        if (props.auctions) {
            this.getQuery();

            if (typeof props.auctions[props.auctions.length - 1] === 'number') {
                const count = props.auctions.pop();
                const pages = Math.ceil(count / this.auctions_per_page);

                this.pages = pages;
                if (this.page > pages) {
                    this.page = pages;
                }

                this.setState({ auctions: props.auctions });

                if (count === 0) {
                    this.no_result = true;
                } else {
                    applyToAuctions((auction) => auction.style.opacity = 1);
                }
            }
        }

        if (this.getQuery(props)) {
            applyToAuctions((auction) => auction.style.opacity = 0.8);
            
            this.props.paginate(this.page || 1, this.auctions_per_page, this.query);
            this.no_result = false;
        }
    }

    paginateTo(index) {
        applyToAuctions((auction) => auction.style.opacity = 0.8);
        this.page = index;
        this.props.paginate(index, this.auctions_per_page, this.query);
    }

    render() {
        const auctions = this.state.auctions;
        const { user } = this.props;

        return (
            <div className="AuctionList">
                {
                    this.pages > 1 && auctions.length > 2 && <Pagination page={this.page} pages={this.pages} clickHandler={this.paginateTo}/>
                }
                { 
                    !auctions.length && !this.no_result ? <Progress /> :
                    auctions.map((auction, i) => {

                        return (
                            <div key={ auction.title + '_' + i } className="auction">
                                <div className="image-wrapper">
                                    {
                                        auction.photos[0] ? <Link to={auctionPath(auction)}><RawImage data={auction.photos[0]} /></Link> : <div className="no-image"></div>
                                    }
                                </div>
                                <div className="text">
                                    <Link to={auctionPath(auction)}><h3>{ auction.title }</h3></Link>
                                    <div className="short-description">{auction.shortdescription}</div>
                                    <p><span className="price">Aktualna cena:</span> <span className="value">{ PriceHelper.write(auction.price.current_price || auction.price.start_price) }</span></p>
                                    <div><span className="time-span">do końca { AuctionEndHelper(auction.date) }</span></div>
                                    <div className="actions">
                                        <div>
                                            <Link to={auctionPath(auction)}><button className="standard-button">Zobacz</button></Link>
                                            <Link to={auctionPath(auction)}><button>Licytuj</button></Link>
                                            <LikeAuction user={user} auction={auction} />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        )
                    })
                }
                {
                    this.no_result && (
                        <div className="no-result">
                            <div>
                                <i className="material-icons">folder_open</i>
                                <h1>Nic nie znalazłem.</h1>
                                <p>Skorzystaj z wyszukiwania zaawansowanego<br /> albo spróbuj pnownie za jakiś czas.</p>
                            </div>
                        </div>
                    )
                }
                {
                    this.pages > 1 && <Pagination page={this.page} pages={this.pages} clickHandler={this.paginateTo}/>
                }
            </div>
        );
    }
};

class CreateUpdateAction extends Component {
   constructor(props) {
       super(props);
       
       let emptyValue = RichTextEditor.createEmptyValue();
       this.state = { subcategories: [], images: [], richText: emptyValue, description: emptyValue.toString('html'), message: [] };
       
       this.handleCategory = this.handleCategory.bind(this);
       this.addAttribute = this.addAttribute.bind(this);
       this.onDrop = this.onDrop.bind(this);
       this.removeImage = this.removeImage.bind(this);
       this.handleRichText = this.handleRichText.bind(this);
       this.validate = this.validate.bind(this);
       this.submit = this.submit.bind(this);
   }
    
   componentWillMount() {
        if (this.props.categories && this.state.subcategories.length === 0) {
            this.setState({ subcategories: this.props.categories[0].subcategories });
        }
   }

   componentWillReceiveProps(props) {
       if (props.categories) {
           this.setState({ subcategories: props.categories[0].subcategories });
       }
   }
    
   handleCategory(event) {
       const select = event.target;
       const value = select.value;
       
       this.setState({ subcategories: this.props.categories.filter(cat => cat.name === value)[0].subcategories});
   }
    
   handleRichText(text) {
       this.setState({ richText: text, description: text.toString('html') });
   }
    
   componentDidMount() {
        this.props.clearAuction();
        let editor = document.querySelector('.rich-text-editor select');
        if (!editor) 
            return;

        let options = editor.childNodes,
           option_text = ['Akapit', 'Duży nagłówek', 'Średni nagłówek', 'Mały nagłówek', 'Linia kodu'];
       
       for (let i = 0, l = options.length; i < l; i++) {
           options[i].innerHTML = option_text.shift();
       }

       const { update } = this.props;
       const { id } = this.props.match.params;

       if (update) {
            this.props.editAuction(id);
       }
   }

   componentWillReceiveProps(props) {
        if (this.props.auctions)
                return;

        if (props.auctions) {
            const auction = props.auctions;
            const queryInput = query => document.querySelector('input' + query);
            const querySelect = query => document.querySelector('select' + query);
            const queryByName = query => document.querySelector(`[name="${query}"]`);
            let input;

            // title
            input = queryByName('title');
            input.value = auction.title;

            // categories
            input = queryByName('main');
            input.value = auction.categories.main;
            this.handleCategory({ target: input });          
            setTimeout(() => {
                input = queryByName('sub');
                input.value = auction.categories.sub;
            }, 1000);
            
            // prices
            input = queryByName('start_price');
            input.value = auction.price.start_price;
            input = queryByName('buy_now_price');
            input.value = auction.price.buy_now_price;
            input = queryByName('min_price');
            input.value = auction.price.min_price;
            input = queryByName('hide_min_price');
            input.checked = auction.price.hide_min_price;

            //time
            input = queryByName('duration');
            input.value = auction.date.duration;

            // photos
            let count = 1,
                files = [];

            if (auction.photos) {
                auction.photos.forEach(photo => {
                    const   type    = photo.type || 'image/jpeg',
                            blob    = b64toBlob(photo.data, type),
                            url     = window.URL.createObjectURL(blob);
 
                    files.push(blob);
                });

                this.onDrop(files);
            }

            if (auction.quantity) {
                input = queryByName('quantity');
                input.value = auction.quantity;
            }

            if (auction.attributes) {
                auction.attributes.map(attribute => {
                    switch(attribute.name) {
                        case 'Stan':
                            input = queryInput(`[name="attribute_Stan"][value="${attribute.value}"]`);
                            input.checked = true;
                            break;
                        default:
                            this.addAttribute(attribute.name);
                            input = queryByName(`attribute_${attribute.name}`);
                            input.value = attribute.value;
                    }
                });
            }

            //descriptions
            input = queryByName('shortdescription');
            input.value = auction.shortdescription;

            if (auction.description) {
                const text = RichTextEditor.createValueFromString(auction.description, 'html');
                this.handleRichText(text);
            }
        }
   }
    
   componentWillUnmount() {
       const { images } = this.state;
       
       for (let i = 0, l = images.length; i < l; i++) {
            const image = images[i];
            URL.revokeObjectURL(image.preview);
       }
   }
    
    addAttribute(update_name) {
        let name = typeof update_name === 'string' ? update_name : window.prompt('Podaj nazwę atrybutu', 'Rozmiar');

        if (!name)
            return;
        
        let input = document.createElement('input');
        input.name = 'attribute_' + name;
        input.type = 'text';

        let label = document.createElement('label');
        label.for = 'attribute_' + name;
        label.innerText = name;
        
        this.attributesRef.appendChild(label);
        this.attributesRef.appendChild(input);
    }

    onDropRejected() {
        alert('Zdjęcie ma niewłaściwy format pliku lub jest za duże');
    }
    
    onDrop(files) {
        if (this.state.images.length > 7) {
            alert('Dodaj maksymalnie 8 zdjęć');
            return;
        }
        
        if (files.length > (8 - this.state.images.length)) {
            files = files.slice(0, (8 - this.state.images.length));
        }

        this.setState(prevState => ({    
            images: prevState.images.concat(files.map(file => ({ file: file, preview: URL.createObjectURL(file) })))
        }));
    }

    removeImage(index) {
        this.setState(prevState => {
            const images = prevState.images;
            URL.revokeObjectURL(images[index].preview);
            return { images: images.slice(0, index).concat(images.slice(index + 1)) };
        });
    }

    validate(event) {
        const input = event.target;
        const name = input.name;
        const value = input.value;

        let message = [];

        switch(name) {
            case 'title':
                if (!/.{4,}/i.test(value)) message[0] = 'Wpisz tytuł';
                break;
            case 'start_price':
                if (!value) message[1] = 'Wpisz cenę wywoławczą';
                break;
            case 'duration':
                if (!value) message[2] = 'Wprowadź czas trwania aukcji';
                break;
            case 'quantity':
                if (!value) message[3] = 'Wprowadź ilość';
                break;
            case 'shortdescription':
                if (!/.{10,}/i.test(value)) message[4] = 'Podaj krótki opis przedmiotu dla wyników wyszukiwań';
                break;
        } 

        this.setState({ message });
        return message.length === 0;
    }
    
    submit(event) {
        event.preventDefault();

        const images = this.state.images;
        const formData = new FormData(this.formRef);
        
        const photoData = new FormData();
        if (this.props.auctions) {
            photoData.append('_id', this.props.auctions._id || null);
        }
        if (images.length > 0) {
            images.forEach(image => {
                photoData.append('images', image.file, image.file.name);
            });
        }

        let allValid = true;
        let inputs = document.querySelectorAll('.Auction input');
        for (let i = 0, l = inputs.length; i < l; i++) {
            if (this.validate({ target: inputs[i] }) !== true) {
                inputs[i].scrollIntoView({ behavior: 'smooth', block: 'center' });
                return;
            }
        }

        if (this.state.images.length < 1) {
            alert('Dodaj chociaż jedno zdjęcie');
            allValid = false;
        }

        if (allValid) {
            if (this.props.update) {
                formData.append('auction_id', this.props.auctions._id);
                this.props.showSpinner();
                this.props.updateAuction(formData)
                    .then(
                        () => this.props.postPhotos(photoData)
                    );
            } else {
                this.props.showSpinner();
                this.props.newAuction(formData)
                    .then(
                        () => this.props.postPhotos(photoData)
                    );
            }
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
   render() {
       const { user, update, categories, auctions } = this.props;
       const userDataComplete = user && user.firstname && user.lastname && user.address;
       const deliveries = user.deliveries && user.deliveries.length;
       const bids = auctions && auctions.bids && auctions.bids.length > 0;

       if (!update && !user.balance.credits) {
            return (
                <div className={ "Profile Auction" + ( update ? ' UpdateAuction' : ' CreateAuction')}>
                    <ProfileLinks active="addauction" />
                    <BuyCredits user={user} />
                </div>
            );
       }

       return (
            <div className={ "Profile Auction" + ( update ? ' UpdateAuction' : ' CreateAuction')}>
                <ProfileLinks active="addauction" />
                <div>
                    {
                        !userDataComplete && <p className="warn"><i className="material-icons">warning</i> <span className="block">Zanim dodasz aukcję, uzupełnij dane w "<Link to="/konto/ustawienia">Ustawieniach konta</Link>" !</span></p>
                    }
                    {
                        !deliveries && <p className="warn"><i className="material-icons">warning</i> <span className="block">Zanim dodasz aukcję, wprowadź metody dostawy towaru w zakładce "<Link to="/konto/aukcje/dostawa">Dostawa</Link>" !</span></p>
                    }
                <form ref={ e => this.formRef = e } className={"user-settings" + (!userDataComplete || !deliveries ? ' disabled' : '')} action="/auction/create_or_update" method="post" encType="multipart/form-data">
                    <h1>{ update ? 'Edytuj aukcję' : 'Dodaj aukcję' }</h1>
        
                    <fieldset>
                        <legend><i className="material-icons">title</i>Tytuł</legend>
                        <p>
                            <label htmlFor="title" className="required">Tytuł aukcji</label>
                            <input name="title" type="string" onInput={this.validate} />
                            <span className="validation-message">{ this.state.message[0] }</span>
                        </p>
                    </fieldset>
       
                    <fieldset>
                        <legend><i className="material-icons">category</i>Kategorie</legend>
                        <p>
                            <select name="main" onChange={ this.handleCategory }>
                                {
                                    categories !== null && categories.map(category => <option key={ category.name } >{category.name}</option>)
                                }
                            </select><span className="label">Kategoria główna</span>
                        </p>
                        <p>
                            <select name="sub">
                                {
                                    this.state.subcategories.map(subcategory => <option key={ subcategory.name }>{subcategory.name}</option>)
                                }
                            </select><span className="label">podkategoria</span>
                        </p>
                    </fieldset>
       
                    <fieldset>
                        <legend><span className="lettr-icon">PLN</span>Cena</legend>
                        <p>
                            <label htmlFor="start_price" className="required">Cena wywoławcza</label>
                            <input name="start_price" type="number" step="0.01" onInput={this.validate} disabled={update && bids} />
                            <span className="validation-message">{ this.state.message[1] }</span>
                        </p>
                        <p>
                            <label htmlFor="buy_now_price">Cena "kup teraz"</label>
                            <input name="buy_now_price" type="number" step="0.01" />
                        </p>
                        <p>
                            <label htmlFor="min_price">Cena minimalna</label>
                            <input name="min_price" type="number" step="0.01" />
                        </p>
                        <p className="checkbox">
                            <span>
                                <input name="hide_min_price" type="checkbox" />
                                <span className="checkbox-value"></span>
                                <span className="label">Ukryj cenę minimalną</span>
                            </span>
                        </p>
                    </fieldset>

                    <fieldset>
                        <legend><i className="material-icons">access_time</i>Czas trwania</legend>
                        <p>
                            <label htmlFor="duration" className="required">Ilość dni</label>
                            <input name="duration" type="number" max="30" min="1" onInput={this.validate} />
                            <span className="validation-message">{ this.state.message[2] }</span>
                        </p>
                    </fieldset>

                    <fieldset>
                        <legend><i className="material-icons">edit_attributes</i>Atrybuty</legend>
                        <p>
                            <span className="label add-horizontal-margin"><span className="orange">*</span> Stan przedmiotu:
                                <input name="attribute_Stan" type="radio" value="nowy" defaultChecked /><span className="label">nowy</span>
                        
                                <input name="attribute_Stan" type="radio" value="używany" /><span className="label">używany</span>
                            </span>
                        </p>
                        <p>
                            <label htmlFor="quantity" className="required">Ilość sztuk</label>
                            <input name="quantity" type="number" min="1" onInput={this.validate} />
                            <span className="validation-message">{ this.state.message[3] }</span>
                        </p>
                        <p className="attributes" ref={ e => this.attributesRef = e }></p>
                        <p>
                            <span className="label add" onClick={this.addAttribute}><i className="material-icons">add_circle_outline</i>Dodaj atrybut</span>
                        </p>
                        
                    </fieldset>

                    <fieldset>
                        <legend><i className="material-icons">photo</i>Zdjęcia</legend>
                        <p><label className="required" style={{ marginBottom: 4 }}>Dodaj chociaż 1 zdjęcie</label></p>
                        <Dropzone className="drag-and-drop-images" 
                            onDrop={ this.onDrop }
                            accept="image/jpeg,image/jpg,image/tiff,image/gif,image/png,image/svg" 
                            multiple={ true }
                            onDropRejected={ this.onDropRejected }
                        >
                            <div className="thumbnails">
                                { 
                                    this.state.images.map((image, index) => (
                                        <div className="container" onClick={(e) => { e.preventDefault(); this.removeImage(index);}}>
                                            <img className="image-preview absolute-center" src={ image.preview } />
                                        </div>
                                    )) 
                                }
                            </div>  
                        </Dropzone>
                    </fieldset>

                    <fieldset>
                        <legend><i className="material-icons">description</i>Opis</legend>
                        <p>
                            <label htmlFor="shortdescription" className="required">Opis skrócony</label>
                            <input name="shortdescription" type="text" onInput={this.validate}/>
                            <span className="validation-message">{ this.state.message[4] }</span>
                        </p>
                        <RichTextEditor
                            className="rich-text-editor"
                            value={ this.state.richText }
                            onChange={ this.handleRichText }
                            placeholder="Opis szczegółowy"
                        />
                        <input name="description" type="hidden" value={this.state.description} />
                        <br />
                        <button type="submit" onClick={this.submit}>{ update ? 'Edytuj' : 'Zapisz' }</button>
                    </fieldset>
                    <input type="hidden" name="start_date" value={ auctions && auctions.date ? auctions.date.start_date : new Date().getTime() } />
                    
                </form>

                </div>
            </div>
       );
   }
}

function mapMyAuctionsUserAndExportedStateToProps({ user, my_auctions, exported }) {
    return { user, my_auctions, exported };
}

function mapMyAuctionsAndUserStateToProps({ user, my_auctions }) {
    return { user, my_auctions };
}

function mapMyAuctionsStateToProps({ my_auctions }) {
    return { my_auctions };
}

function mapAuctionsStateToProps({ auctions }) {
    return { auctions };
}
function mapAuctionsAndUserStateToProps({ auctions, user }) {
    return { auctions, user };
}

function mapCategoryStateToProps({ categories }) {
    return { categories };
}
function mapUserAndCategoryStateToProps({ user, categories }) {
    return { user, categories };
}
function mapAuctionsUserAndCategoryStateToProps({ auctions, user, categories }) {
    return { auctions, user, categories };
}

function mapOtherUserStateToProps({ other_user }) {
    return { other_user };
}

function combineUserAndAuctionsStateToProps({ auctions, user }) {
    return { auctions, user };
}
function mapAuctionsPhotosUserAndOtherUserStateToProps({ auctions, photos, user, other_user }) {
    return { auctions, photos, user, other_user };
}
function mapTechBreakStatesToProps({ tech_break }) {
    return { tech_break };
}

LikeAuction = connect(null, auctionActions)(LikeAuction);
BuyCredits = connect(mapTechBreakStatesToProps, przelewy24Actions)(BuyCredits);
Pay = connect(mapOtherUserStateToProps, {...otherUserActions, ...przelewy24Actions})(Pay);
FrontPage = connect(mapAuctionsStateToProps, auctionActions)(FrontPage);
CreateUpdateAction = connect(mapAuctionsUserAndCategoryStateToProps, {...profileActions, ...auctionActions})(CreateUpdateAction);
FilteredList = connect(mapAuctionsAndUserStateToProps, auctionActions)(FilteredList);
AuctionList = connect(mapAuctionsAndUserStateToProps, auctionActions)(AuctionList);
MyAuctionList = connect(mapMyAuctionsUserAndExportedStateToProps, {...auctionActions, ...myAuctionActions, ...importExportActions})(MyAuctionList);
AuctionDetails = connect(mapAuctionsPhotosUserAndOtherUserStateToProps, {...auctionActions, ...photosActions, ...otherUserActions})(AuctionDetails);

export { CreateUpdateAction, AuctionList, MyAuctionList, AuctionDetails, FrontPage, FilteredList, applyToAuctions };