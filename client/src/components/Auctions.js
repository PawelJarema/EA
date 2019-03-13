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
import './auctions/Auction.css';

import { Link } from 'react-router-dom';
import { Pagination } from './Pagination';
import { AuctionPagination } from './AuctionPagination';
import { ProfileLinks } from './Profile';
import { ImageProgress } from './Progress';

import CategoryFilters from './CategoryFilters';

import LikeAuction from './auctions/Like';
import Pay from './auctions/Pay';
import RateAuction from './auctions/RateAuction';

import Modal from './Modal';

import NameHelper from '../helpers/nameHelper';
import PriceHelper from '../helpers/priceHelper';
import AuctionEndHelper from '../helpers/auctionEndHelper';

import RawImage from './auctions/RawImage';
import Progress from './Progress';

import FrontPage from './FrontPage';
import AuctionDetails from './auctions/AuctionDetails';
import CreateUpdateAuction from './auctions/CreateUpdate';

import { userName, applyToAuctions, auctionPath } from './auctions/functions';


class FilteredList extends Component {
    componentWillReceiveProps(props) {
        if (props.auctions) {
            if (typeof props.auctions[props.auctions.length - 1] === 'number') {
                this.props.setPages(props.auctions.pop());
                applyToAuctions(auction => auction.style.opacity = 1);

                if (window.innerWidth < 1296) {
                    if (this.scrollTimeout) clearTimeout(this.scrollTimeout);
                    this.scrollTimeout = setTimeout(() => {
                        if (this.listRef && window.scrollY < 100)
                            this.listRef.scrollIntoView({ block: 'start', behavior: 'smooth' });
                    }, 4000);
                }
            }
        }
    }

    render() {
        const 
            { user, page, pages, per_page, sort, setPage, perPageCallback, sortCallback } = this.props,
            auctions = this.props.auctions;

        const pagination = <AuctionPagination page={page} pages={pages} per_page={ per_page } sort={ sort } clickHandler={setPage} sortCallback={ sortCallback } perPageCallback={ perPageCallback }/>;
        
        return (
            <div className="Filtered AuctionList" ref={ (e) => this.listRef = e }>
                {
                    pagination
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
                        const 
                            own = String(auction._user) === String(user._id),
                            promo = typeof auction.premium === 'object',
                            isPremium = promo ? auction.premium.isPremium : false,
                            isQuality = promo ? auction.premium.forever : false;

                        return (
                            <div key={ auction.title + '_' + i } className={ "auction"  + ( isPremium ? ' premium' : '' ) + ( isQuality ? ' quality' : '' ) }>
                                <div className="image-wrapper">
                                    {
                                        <Link to={auctionPath(auction)}><RawImage link={auction} /></Link>
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
                                            { !own && <Link to={auctionPath(auction)}><button>Licytuj</button></Link> }
                                            { !own && <LikeAuction user={user} auction={auction} /> }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                }
                {
                    pagination
                }
            </div>
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
                                    <Link to={auctionPath(auction)}><RawImage link={auction} /></Link>
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
                                <p>Spróbuj pnownie za jakiś czas.</p>
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


function mapMyAuctionsUserAndExportedStateToProps({ user, my_auctions, exported }) {
    return { user, my_auctions, exported };
}

function mapMyAuctionsAndUserStateToProps({ user, my_auctions }) {
    return { user, my_auctions };
}

function mapMyAuctionsStateToProps({ my_auctions }) {
    return { my_auctions };
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

function combineUserAndAuctionsStateToProps({ auctions, user }) {
    return { auctions, user };
}

function mapTechBreakStatesToProps({ tech_break }) {
    return { tech_break };
}

BuyCredits = connect(mapTechBreakStatesToProps, przelewy24Actions)(BuyCredits);
FilteredList = connect(mapAuctionsAndUserStateToProps, auctionActions)(FilteredList);
AuctionList = connect(mapAuctionsAndUserStateToProps, auctionActions)(AuctionList);
MyAuctionList = connect(mapMyAuctionsUserAndExportedStateToProps, {...auctionActions, ...myAuctionActions, ...importExportActions})(MyAuctionList);

export { CreateUpdateAuction, AuctionList, MyAuctionList, AuctionDetails, FrontPage, FilteredList, applyToAuctions };