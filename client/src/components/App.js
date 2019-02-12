import React, { Component } from 'react';
import './App.css';
import './Mobile.css';

import { BrowserRouter, Route, Link, Switch, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import * as categoryActions from '../actions/categoryActions';
import * as flashActions from '../actions/flashActions';
import * as countActions from '../actions/statisticActions';
import * as techBreakActions from '../actions/techBreakActions';
import * as cookieActions from '../actions/cookieActions';

import { Navi, MobileMenu, UserLinks, Breadcrumbs } from './Navigation';
import { AuctionList, MyAuctionList, AuctionDetails, FrontPage, FilteredList } from './Auctions';
import { RegistrationLanding, LoginLanding } from './Landing';
import { Settings, CreateUpdateAuction, Delivery, ProfileLinks, MyOpinions, Invoices } from './Profile';
import { AdminPanel, TechBreak } from './Admin';
import { CategoryLinks, FooterLinks, FooterBar } from './Footer';
import { Page404 } from './Page404';
import CategoryFilters from './CategoryFilters';
import Filters from './Filters';
import Progress from './Progress';
import Ads from './Ads';

import socketIOClient from 'socket.io-client';

class AuctionListSearch extends Component {
    constructor(props) {
        super(props);
        this.state = { page: 1, pages: 1, per_page: 10 };

        this.setPage = this.setPage.bind(this);
        this.setPages = this.setPages.bind(this);
    }

    setPage(page) {
        this.setState({ page });
    }

    setPages(pages) {
        if (pages >= this.state.page) {
            this.setState({ pages });
        } else {
            this.setState({ page: pages, pages });
        }
    }

    render() {
        const { page, pages, per_page } = this.state;
        const { user, categories, query, category, categoryData, categoryCallback } = this.props;

        return (
            <div className="AuctionListSearch">
                <Filters match={ this.props.match } page={ page } pages={ pages } per_page={ per_page } query={ query } category={ category } user={ user } categories={ categories } categoryData={ categoryData } categoryCallback={ categoryCallback } />
                <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <CategoryFilters categories={ categories } categoryCallback={ categoryCallback } category={ category } categoryData={ categoryData } />
                    <FilteredList page={ page } pages={ pages } setPage={ this.setPage } setPages={ this.setPages } />
                </div>
            </div>
        );
    }
}

class CookieMessage extends Component {
    render() {
        const { cookies } = this.props;

        if (!cookies) {
            return (
                <div className="cookie-message">
                    <div>
                        <img src="/assets/cookies.png" />
                    </div>
                    <p>
                        <h3>Ciasteczka</h3>
                        <p>Serwis używa ciasteczek aby składować istotne informacje dotyczące operacji wykonywanych w serwisie. Włączenie obsługi ciasteczek ułatwia korzystanie z serwisu i jest wymagane. Wszystkie Państwa informacje są zaszyfrowane i gruntownie zabezpieczone.</p>
                        <h3>Rodo</h3>
                        <p>25 maja 2018 roku zaczęło obowiązywać Rozporządzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (RODO). Uprzejmie informujemy, że administratorem Państwa danych osobowych jest firma Polmarket. Celem przetwarzania danych jest realizacja prawnych obowiązków administratora.</p>
                        <button className="standard-button" onClick={this.props.allowCookies}>Rozumiem i wyrażam zgodę</button>
                    </p>
                </div>
            );
        } else {
            return null;
        }
        
    }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        search_query: '',
        category_filter_data: {},
        endpoint: process.env.REACT_APP_CHAT_URL, 
        socket: null,
        chatBox: null
    };

    this.setQuery = this.setQuery.bind(this);
    this.callback = this.callback.bind(this);
    this.categoryFilterCallback = this.categoryFilterCallback.bind(this);
  }
  
  setQuery(search_query) {
    this.setState({ search_query })
  }

  categoryFilterCallback(object) {
    this.setState({ category_filter_data: object });
  }

  componentWillReceiveProps(props) {
    if (props.flash) {
        setTimeout(this.props.clearMessage, 5000);
    }
    if (props.user && !this.state.socket) {
        const { endpoint } = this.state;
        const socket = socketIOClient(endpoint);
        socket.on("handshake", data => {
            socket.emit("handshake", String(props.user._id));
        });
        this.setState({ socket });
    }
  }

  componentDidMount() {
      this.props.fetchCookies();
      this.props.fetchTechBreak();
      this.props.fetchCategories();
      this.props.fetchUser();
      this.props.fetchMessage();
  }

  callback(chatBox) {
    this.setState({ chatBox });
  }

  render() {
    const 
        { socket, chatBox, category_filter_data, search_query } = this.state,
        { user, flash, tech_break, cookies, categories } = this.props;

    const 
        message = flash !== null && flash !== false ? <div className={ "flash-message " + flash.type }>{ flash.message }</div> : null,
        w_width = window.innerWidth;

    if (tech_break && tech_break.techbreak === false) {
        return (
          <div className="App">
            { 
                message
            }
            <BrowserRouter>
                <div>
                    <header className="App-header" style={{ marginBottom: 30 }}>
                        <Navi socket={ socket } callback={ this.callback } setQuery={ this.setQuery } categoryCallback={ this.categoryFilterCallback } categoryData={ category_filter_data } />
                        <Breadcrumbs />
                    </header>
            
                    <div className="main-container">
                            <CookieMessage cookies={cookies} />
                            
                            <Route exact path="/" render={ props => <FrontPage {...props} categories={ categories } categoryCallback={ this.categoryFilterCallback } /> } categoryData={ category_filter_data } />
                            <Route exact path="/aukcje" render={ props => <AuctionListSearch {...props} user={user} query={search_query} categories={categories} categoryData={ category_filter_data } categoryCallback={ this.categoryFilterCallback } /> } />
                            <Route exact path="/aukcje/szukaj/:category/:query" render={ props => <AuctionListSearch {...props} user={user} query={search_query} categories={categories} categoryData={ category_filter_data } categoryCallback={ this.categoryFilterCallback } /> } />
                            <Route exact path="/aukcje/wyszukiwanie-zaawansowane/:category/:query/:min/:max/:state/:sort" render={props => <AuctionListSearch {...props} user={user} query={search_query} categories={categories} categoryData={ category_filter_data } categoryCallback={ this.categoryFilterCallback } /> } />
                            <Route exact path="/aukcje/:id" render={ (props) => <AuctionDetails {...props} socket={socket} /> } />
                            <Route exact path="/aukcje/:title/:id" render={ (props) => <AuctionDetails {...props} socket={socket} /> } />
                            <Route path="/konto/zarejestruj" component={ RegistrationLanding } />
                            <Route path="/konto/zaloguj" component={ LoginLanding } />
                            <Route path="/admin" component={ AdminPanel } />

                            {
                                user && <div>
                                    <Route exact path="/moje-aukcje" render={ (props) => <MyAuctionList {...props} mode='current_auctions' /> } />
                                    <Route exact path="/moje-aukcje/zakonczone" render={ (props) => <MyAuctionList {...props} mode='ended_auctions' /> } />
                                    <Route exact path="/moje-licytacje/" render={ (props) => <MyAuctionList {...props} mode='current_bids' /> } />
                                    <Route exact path="/moje-licytacje/zakonczone" render={ (props) => <MyAuctionList {...props} mode='ended_bids' /> } />
                                    <Route exact path="/polubione-aukcje" render={ (props) => <MyAuctionList {...props} mode='liked' /> } />
                                    <Route path="/konto/ustawienia" component={ Settings } />
                                    <Route path="/konto/opinie" component={ MyOpinions } />
                                    <Route path="/konto/faktury" component={ Invoices } />
                                    <Route path="/konto/aukcje/dodaj" component={ CreateUpdateAuction } />
                                    <Route path="/edytuj-aukcje/:title/:id" render={ (props) => <CreateUpdateAuction {...props} update={true} /> } />
                                    <Route path="/konto/aukcje/dostawa" component={ Delivery } />
                                </div>
                            }
                    </div>

                    <div className="Chat">{ chatBox }</div>

                    <section className="advertising">
                        <div className="four-column">
                            <div className="column">
                                <Ads />
                            </div>

                            {
                                w_width > 1000 && (
                                    <div className="column">
                                        <Ads />
                                    </div>
                                )
                            }

                            {
                                w_width > 1250 && (
                                    <div className="column">
                                        <Ads />
                                    </div>
                                )
                            }

                            {
                                w_width > 1500 && (
                                    <div className="column">
                                        <Ads />
                                    </div>
                                )
                            }
                        </div>
                    </section>

                    <footer>
                        <CategoryLinks categoryCallback={ this.categoryFilterCallback } />
                        <FooterLinks />
                        <FooterBar />
                    </footer>

                </div>
            </BrowserRouter>
          </div>
        );
    } else if (tech_break && tech_break.techbreak === true) {
        return (
            <div className="App">
                {
                    message
                }
                <BrowserRouter>
                    <div className="main-container">
                        <Route exact path="/" component={ TechBreak } />
                        <Route path="/admin" component={ AdminPanel } />
                    </div>
                </BrowserRouter>

            </div>
        );
    } else {
        return <Progress />;
    }
  }
}

function mapUserAndFlashStatesToProps({ user, flash }) {
    return { user, flash };
}
function mapUserFlashTechBreakAndCookiesStatesToProps({ user, flash, tech_break, cookies, categories }) {
    return { user, flash, tech_break, cookies, categories };
}
function mapFlashToProps({ flash }) {
    return { flash };
}

function aggregateProps({ user, categories, flash }) {
    return { user, categories, flash };
}

function mapAuctionCountStateToProps({ auction_count }) {
    return { auction_count };
}

CookieMessage = connect(null, cookieActions)(CookieMessage);

export default connect(mapUserFlashTechBreakAndCookiesStatesToProps, { ...userActions, ...categoryActions, ...flashActions, ...techBreakActions, ...cookieActions })(App);
