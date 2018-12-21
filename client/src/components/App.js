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

import { AuctionList, MyAuctionList, AuctionDetails, FrontPage } from './Auctions';
import { RegistrationLanding, LoginLanding } from './Landing';
import { Settings, CreateUpdateAction, Delivery, ProfileLinks, MyOpinions, Invoices } from './Profile';
import { AdminPanel, TechBreak } from './Admin';
import Progress from './Progress';
import Chat from './Chat';

import socketIOClient from 'socket.io-client';


const ProductCategories = {
    'Eletkronika': ['RTV i AGD', 'Komputery', 'Mac', 'PC', 'Konsole', 'Telefony i akcesoria', 'Fotografia cyfrowa'],
    'Moda': ['Obuwie', 'Odzież', 'Biżuteria', 'Zegarki'],
    'Dom i ogród': ['Ogród', 'Kwiaty', 'Meble', 'Wyposażenie wnętrz', 'Zwierzęta'],
    'Dziecko': ['Zabawki', 'Ubranka', 'Żywność', 'Artykuły szkolne'],
    'Rozrywka i gry': ['Gry', 'Książka', 'Komiks', 'Muzyka', 'Film', 'Warhammer, gry bitewne', 'Gry planszowe'],
    'Sport': ['Rower', 'Turystyka', 'Boks', 'Bieganie', 'Sztuki walki'],
    'Motoryzacja': ['Samochód', 'Motocykl', 'Quad', 'Opony', 'Części samochodowe'],
    'Sztuka': ['Malarstwo', 'Rysunek', 'Antyki', 'Rękodzieło', 'Wyroby WTZu', 'Artykuły kreatywne'],
    'Firma': ['Oprogramowanie', 'Księgowość', 'Akcesoria przemysłowe', 'Nieruchomości', 'Akcesoria BHP'],
    'Zdrowie': ['Zioła', 'Ubezpieczenie', 'Poradniki', 'Suplementy']
};

class Logo extends Component {
    render() {
        // <Link to="/"><div className="logo"><i className="material-icons">gavel</i>E-Aukcje</div></Link>
        return (
            <Link to="/"><div className="logo"><img src="/assets/logo.png" alt="logo"/></div></Link>
        );
    }
}

class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = { category: 'Kategorie', query: '', select: false };    
        
        this.openSelect = this.openSelect.bind(this);
        this.showSubcategories = this.showSubcategories.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    
    componentDidMount() {
        this.closeSelect = () => this.setState({select: false});
        window.addEventListener('click', this.closeSelect);
    }
    
    componentWillUnmount() {
        window.removeEventListener('click', this.closeSelect);
    }
    
    openSelect(event) {
        event.stopPropagation();
        this.setState(prev => ({ select: !prev.select }));
    }
    
    showSubcategories(event) {
        event.stopPropagation();
        this.handleCategory(event);
        
        const element = event.target;
        
        let sibling = element.nextSibling;
        while (sibling && sibling.className.indexOf('child') !== -1) {
            let display = sibling.style.display;
            sibling.style.display = display === 'none' ? 'block' : 'none';
            
            sibling = sibling.nextSibling;
        }
    }
    
    handleCategory(event) {
        const element = event.target;
        const value = element.innerHTML;
        
        this.setState({ category: value });
    }
    
    handleInput(event) {
        const input = event.target;
        const query = input.value;

        this.setState({ query });
    }

    render() {
        const { open, categories } = this.props;
        const className = "search-auctions" + (open ? ' open' : '');
        if (categories === null || categories === false)
            return null;
        
        let all_categories = [];
        
        categories.map(category => {
            all_categories.push({ type: 'main', name: category.name });
            all_categories = all_categories.concat(category.subcategories.map(subcategory => ({ type: 'child', name: subcategory.name })));
        });
        
        return (
            <div className={className}>
                <div className="inputs">
                    <i className="material-icons">search</i>
                    <span>
                        <input name="item" placeholder="Czego szukasz?" type="text" className="item" onChange={this.handleInput}/>
                    </span>
                    <span style={{ position: 'relative' }}>
                        <span className="select-value" onClick={ this.openSelect }>{ this.state.category }</span>
                        { 
                            this.state.select && (<div className="select">
                                {
                                    all_categories && all_categories
                                        .map(category => (
                                           category.type === 'main' 
                                           ?
                                           <div className="main" onClick={this.showSubcategories}>{ category.name }</div>
                                           :
                                           <div className="child" style={{ display: 'none' }} onClick={this.handleCategory}>{ category.name }</div>

                                        ))
                                }
                            </div>)
                        }
                    </span>
                </div>
                <div>
                    <Link to={`/aukcje/szukaj/${this.state.category}/${this.state.query || '*'}`}><button className="search-button">Szukaj</button></Link>
                </div>
            </div>
        )
    }
}

class UserLinks extends Component {
    render() {
        const { user, open, searchHandler } = this.props;
        const className = "user-links" + (open ? ' open' : '');

        const Search = <span className="link search-mobile" onClick={searchHandler}><i className="material-icons">search</i></span>;
        
        if (user !== false && user !== null) {
            return (
                <div className={className}>
                    <Link to="/moje-aukcje">Moje aukcje</Link>
                    { Search }
                    <Chat socket={ this.props.socket } id={user._id} />
                    <span className="link">
                        <img src="/assets/icons/user.png" />
                        <div className="dropdown">
                            <Link to="/konto/" className="account">Konto</Link>
                            <Link to="/konto/ustawienia" className="settings">Ustawienia</Link>
                            <Link to="/konto/aukcje/dodaj" className="add-auction">Dodaj Aukcję</Link>
                            <a href="/api/logout" className="logout">Wyloguj</a>
                        </div>
                    </span>
                </div>
            );
        } else if (user !== null) {
            return (
                <div className={className}>
                    { Search }
                    <Link to="/konto/zaloguj">Zaloguj</Link>
                    <Link to="/konto/zarejestruj">Zarejestruj się</Link>
                </div>
            );
        } else {
            return null
        }
    }
}

class MobileMenu extends Component {
    render() {
        const { open, clickHandler } = this.props;

        return (
            <div className={"MobileMenu" + (open ? ' open' : '')} onClick={clickHandler}>
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    }
}

class Navi extends Component {
    constructor(props) {
        super(props);
        this.state = { mobile: false, search: false };
        this.clickHandler = this.clickHandler.bind(this);
        this.searchHandler = this.searchHandler.bind(this);
    }

    clickHandler() {
        this.setState(prev => ({mobile: !prev.mobile }));
    }

    searchHandler() {
        this.setState(prev => ({search: !prev.search}));
    }

    render() {
        const { mobile, search } = this.state;

        return (
            <nav>
                <Logo />
                <SearchField open={search} />
                <MobileMenu open={mobile} clickHandler={this.clickHandler} />
                <UserLinks open={mobile} socket={ this.props.socket } searchHandler={this.searchHandler} />
            </nav>
        );
    }
}

class Breadcrumbs extends Component {
    constructor(props) {
        super(props);
        this.state = { current_url: '/', current_path: [{ link: 'Home', url: '/' }] };
    }

    getPath() {
        const root = [{ link: 'Home', url: '/' }];
        const path = window.location.href;
        const parts = path.split(/http:\/\/|\/|https:\/\//i);

        const new_parts = parts.slice(2).map(part => ({ link: part.slice(0,1).toUpperCase() + part.slice(1), url: part }));
        
        this.setState({ current_url: path, current_path: root.concat(new_parts)});
    }

    componentDidMount() {
        this.getPath();
    }

    componentDidUpdate() {
        window.scrollTo(0, 0);

        const { current_url } = this.state;
        if (current_url !== window.location.href) {
            this.getPath();
        }
    }

    render() {
        const current_path = this.state.current_path.slice(0, 3);
        
        return (
            <div className="breadcrumbs">
                {
                    current_path.filter(frag => frag.link.length).map(
                        (frag, index) => (
                            <span key={frag}>
                                {
                                    index < current_path.length - 1 ? (
                                        <Link to={ '/' + current_path.slice(1, index + 1).map(p => p.url).join('/') }>
                                            { frag.link }
                                        </Link>
                                    ) : (
                                        <span>{ frag.link.replace('#', '') }</span>
                                    )
                                }
                            </span>
                        )
                    )
                }
            </div>
        );
    }
}
Breadcrumbs = withRouter(Breadcrumbs);

class CategoryLink extends Component {
    render() {
        const category = this.props.data;
        const subcategories = category.subcategories;
        
        return (
            <div className="categories">
                <Link to={`/aukcje/szukaj/${category.name}/*`}><strong>{category.name}</strong></Link>
                {
                    subcategories.map(subcategory => <Link key={subcategory.name} to={`/aukcje/szukaj/${subcategory.name}/*`}>{ subcategory.name }</Link>) //* */
                }
            </div>
        );
    }
}

class CategoryLinks extends Component {
    render() {
        const categories = this.props.categories;
        
        if (categories === null || categories === false)
            return null;
 
        const top = categories.slice(0, 6);
        const bottom = categories.slice(6);
        
        return (
            <div className="category-links">
                <div className="row">
                    {
                        top.map(category => (
                            <div key={category.name} className="column">
                                <CategoryLink data={category} />
                            </div>
                        ))
                    }
                </div>
                <div className="row">
                    <div className="column">
                        <Link to="/"><Logo /></Link>
                    </div>
                    {
                        bottom.map(category => (
                            <div key={category.name} className="column">
                                <CategoryLink data={category} />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

class FooterBar extends Component {
    render() {
        return (
            <div className="footer-bar">
                <div>Copyright © 2018. Wszelkie prawa zastrzeżone.</div>
                <div>Właścicielem portalu jest Polmarket</div>
                <div>Powered by ADAWARDS</div>
            </div>
        );
    }
}

class AdvancedSearch extends Component {
    constructor(props) {
        super(props);

        const params = window.location.href.split(/[/||//]/).slice(7);

        this.state = { query: props.match.params.query, min: params[0] || 0, max: params[1] || 0, state: params[2] || '*', sort: params[3] || '*' };
        
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        this.props.countAuctions(this.props.match.params.category);
    }

    componentWillReceiveProps(props) {
        if (props.match.params.query != this.props.match.params.query || props.match.params.category != this.props.match.params.category) {
            this.props.countAuctions(props.match.params.category);
        }
    }

    handleInput(event) {
        const input = event.target;
        const name = input.name;
        const type = input.type;
        const value = input.value;

        this.setState({ [name]: value });
    }

    render() {
        const stats = this.props.auction_count;

        return (
            <div className="advanced-search">
                <h3>Wyszukiwanie zaawansowane</h3>
                <form>
                    <div>
                        <div className="label"><i className="material-icons">attach_money</i>Cena</div>
                        <p>
                            <input name="min" type="number" min="1" step="0.01" placeholder="od" value={this.state.min} onChange={this.handleInput}/>
                            <input name="max" type="number" min="1" step="0.02" placeholder="do" value={this.state.max} onChange={this.handleInput}/>
                        </p>
                    </div>
                    <div>
                        <div className="label"><i className="material-icons">search</i>Stan</div>
                        <p>
                            <input name="state" type="radio" value="nowe" checked={this.state.state === 'nowe'} onChange={this.handleInput}/><span className="label">Nowy</span>
                        </p>
                        <p>
                            <input name="state" type="radio" value="uzywane" checked={this.state.state === 'uzywane'} onChange={this.handleInput}/><span className="label">Używany</span>
                        </p>
                        <p>
                            <input name="state" type="radio" value="nd" checked={this.state.state === 'nd'} onChange={this.handleInput}/><span className="label">Wszystkie</span>
                        </p>
                    </div>
                    <div>
                        <div className="label"><i className="material-icons">sort_by_alpha</i>Sortuj</div>
                        <p>
                            <input name="sort" type="radio" value="tanie" checked={this.state.sort === 'tanie'} onChange={this.handleInput}/><span className="label">od najtańszych</span>
                        </p>
                        <p>
                            <input name="sort" type="radio" value="drogie" checked={this.state.sort === 'drogie'} onChange={this.handleInput}/><span className="label">od najdroższych</span>
                        </p>
                        <p>
                            <input name="sort" type="radio" value="alfabetycznie" checked={this.state.sort === 'alfabetycznie'} onChange={this.handleInput}/><span className="label">alfabetycznie</span>
                        </p>
                    </div>
                    <div>
                        <div className="label"><i className="material-icons">title</i>Tytuł</div>
                        <p>
                            <input style={{width: 'calc(100% - 22px)', fontSize: '16px'}} name="query" type="text" value={this.state.query} onChange={this.handleInput}/>
                        </p>
                    </div>
                    <input name="category" type="hidden" value={this.props.match.params.category}/>
                    <Link to={`/aukcje/wyszukiwanie-zaawansowane/${this.props.match.params.category || 'Kategorie'}/${this.state.query || '*'}/${this.state.min}/${this.state.max}/${this.state.state || '*'}/${this.state.sort}`}><button>Szukaj</button></Link>
                   
                </form>
                <div>
                    <h3>Inne przedmioty</h3>
                    <div className="items">
                        {
                            stats && (
                                stats.map((stat, index) => (
                                    <Link key={stat.name + '_' + stat.count} to={`/aukcje/szukaj/${stat.name}/${'*'}`}>
                                        <div className="item">
                                            <div className="name">{ stat.name }</div>
                                            <div className="count">{ stat.count }</div>
                                        </div>
                                    </Link>
                                ))
                            )
                        }
                    </div>
                </div>
            </div>
        );
    }
}

const Test = () => <div>Test</div>;
class AuctionListSearch extends Component {
    render() {
        return (
            <div className="AuctionListSearch">
                <AdvancedSearch match={ this.props.match } />
                <AuctionList match={ this.props.match } />
            </div>
        );
    }
}

class AuctionListSearchClosed extends Component {
    render() {
        return (
            <div className="AuctionListSearch">
                <AdvancedSearch match={ this.props.match } />
            </div>
        );
    }
}

class ProfileLinksClosed extends Component {
    render() {
        return (
             <div className="Profile ProfileSettings">
                <ProfileLinks />
             </div>
        );
    }
}

class Page404 extends Component {
    render() {
        return (
            <div>
                <div className="no-result">
                    <i className="material-icons">build</i>
                    <h1>Błąd 404</h1>
                    <p>Strona o którą prosisz nie istnieje</p>
                </div>
            </div>
        )
    }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { 
        endpoint: process.env.REACT_APP_CHAT_URL, 
        socket: null 
    };
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
      this.props.fetchTechBreak();
      this.props.fetchCategories();
      this.props.fetchUser();
      this.props.fetchMessage();
  }

  render() {
    const { socket } = this.state;
    const { user, flash, tech_break } = this.props;

    const message = flash !== null && flash !== false ? <div className={ "flash-message " + flash.type }>{ flash.message }</div> : null;

    if (tech_break && tech_break.techbreak === false) {
        return (
          <div className="App">
            { 
                message
            }
            
            <BrowserRouter>
                <div>
                    <header className="App-header" style={{ marginBottom: 30 }}>
                        <Navi socket={ socket } />
                        <Breadcrumbs />
                    </header>
            
                    <div className="main-container">
          
                            <Route exact path="/" component={ FrontPage } />
                            <Route exact path="/aukcje" component={ AuctionListSearchClosed } />
                            <Route exact path="/aukcje/szukaj/:category/:query" component={ AuctionListSearch } />
                            <Route exact path="/aukcje/wyszukiwanie-zaawansowane/:category/:query/:min/:max/:state/:sort" component={ AuctionListSearch } />
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
                                    <Route path="/konto/aukcje/dodaj" component={ CreateUpdateAction } />
                                    <Route path="/edytuj-aukcje/:title/:id" render={ (props) => <CreateUpdateAction {...props} update={true} /> } />
                                    <Route path="/konto/aukcje/dostawa" component={ Delivery } />
                                    <Route exact path="/konto" component={ ProfileLinksClosed } />
                                </div>
                            }
                    </div>

                    <footer>
                        <CategoryLinks />
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

function mapUserStateToProps({ user }) {
    return { user };
}
function mapUserAndFlashStatesToProps({ user, flash }) {
    return { user, flash };
}
function mapUserFlashAndTechBreakStatesToProps({ user, flash, tech_break }) {
    return { user, flash, tech_break };
}
function mapCategoryStateToProps({ categories }) {
    return { categories };
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

SearchField = connect(mapCategoryStateToProps)(SearchField);
UserLinks = connect(mapUserStateToProps)(UserLinks);
CategoryLinks = connect(mapCategoryStateToProps)(CategoryLinks);
AdvancedSearch = connect(mapAuctionCountStateToProps, countActions)(AdvancedSearch);

export default connect(mapUserFlashAndTechBreakStatesToProps, { ...userActions, ...categoryActions, ...flashActions, ...techBreakActions })(App);
