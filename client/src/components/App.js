import React, { Component } from 'react';
import './App.css';

import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import * as categoryActions from '../actions/categoryActions';
import * as flashActions from '../actions/flashActions';
import * as countActions from '../actions/statisticActions';

import { AuctionList, AuctionDetails } from './Auctions';
import { RegistrationLanding, LoginLanding } from './Landing';
import { Settings, CreateUpdateAction, Delivery } from './Profile';



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
        return (
            <Link to="/"><div className="logo"><i className="material-icons">gavel</i>E-Aukcje</div></Link>
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
        if (this.props.categories === null || this.props.categories === false)
            return null;
        
        let categories = [];
        
        this.props.categories.map(category => {
            categories.push({ type: 'main', name: category.name });
            categories = categories.concat(category.subcategories.map(subcategory => ({ type: 'child', name: subcategory.name })));
        });
        
        return (
            <div className="search-auctions">
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
                                    categories && categories
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
SearchField = connect(mapCategoryStateToProps)(SearchField);

class UserLinks extends Component {
    render() {
        const user = this.props.user;
        
        if (user !== false && user !== null) {
            return (
                <div className="user-links">
                    <a href="#">Moje aukcje</a>
                    <span className="link">
                        <i className="material-icons">account_circle</i>
                        <div className="dropdown">
                            <a href="/api/logout" className="logout">Wyloguj</a>
                            <Link to="/konto/ustawienia" className="settings">Ustawienia</Link>
                            <Link to="/konto/aukcje/dodaj" className="add-auction">Dodaj Aukcję</Link>
                        </div>
                    </span>
                </div>
            );
        } else if (user !== null) {
            return (
                <div className="user-links">
                    <Link to="/konto/zaloguj">Zaloguj się</Link>
                    <Link to="/konto/zarejestruj">Zarejestruj się</Link>
                </div>
            );
        } else {
            return null
        }
    }
}
UserLinks = connect(mapUserStateToProps)(UserLinks);

class Navi extends Component {
    render() {
        return (
            <nav>
                <Logo />
                <SearchField />
                <UserLinks />
            </nav>
        );
    }
}

class Breadcrumbs extends Component {
    render() {
        const current_path = ['Home', 'Library', 'Data'];
        
        return (
            <div className="breadcrumbs">
                {
                    current_path.map(frag => <span key={frag}>{ frag }</span>)
                }
            </div>
        );
    }
}

class CategoryLink extends Component {
    render() {
        const category = this.props.data;
        const subcategories = category.subcategories;
        
        return (
            <div className="categories">
                <a href="#"><strong>{category.name}</strong></a>
                {
                    subcategories.map(subcategory => <a key={subcategory.name} href="#">{ subcategory.name }</a>)
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

CategoryLinks = connect(mapCategoryStateToProps)(CategoryLinks);

class FooterBar extends Component {
    render() {
        return (
            <div className="footer-bar">
                <div>Copyright © 2018. Wszelkie prawa zastrzeżone.</div>
                <div>Właścicielem portalu jest</div>
                <div>Powered by MongoDB</div>
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
                    <Link to={`/aukcje/wyszukiwanie-zaawansowane/${this.props.match.params.category}/${this.state.query || '*'}/${this.state.min}/${this.state.max}/${this.state.state || '*'}/${this.state.sort}`}><button>Szukaj</button></Link>
                   
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

function mapAuctionCountStateToProps({ auction_count }) {
    return { auction_count };
}

AdvancedSearch = connect(mapAuctionCountStateToProps, countActions)(AdvancedSearch)

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

class App extends Component {
  
  componentWillReceiveProps(props) {
    if (props.flash) {
        setTimeout(this.props.fetchMessage, 5000);
    }
  }

  componentDidMount() {
      this.props.fetchCategories();
      this.props.fetchUser();
      this.props.fetchMessage();
  }
    
  render() {
    const message = this.props.flash;

    return (
      <div className="App">
        { 
            message !== null && message !== false && <div className={ "flash-message " + message.type }>{ message.message }</div>
        }
        
        <BrowserRouter>
            <div>
                <header className="App-header" style={{ marginBottom: 30 }}>
                    <Navi />
                    <Breadcrumbs />
                </header>
        
                <div className="main-container">
                    <Route exact path="/" component={ AuctionList } />
                    <Route path="/aukcje/szukaj/:category/:query" component={ AuctionListSearch } />
                    <Route path="/aukcje/wyszukiwanie-zaawansowane/:category/:query/:min/:max/:state/:sort" component={ AuctionListSearch } />
                    <Route path="/konto/zarejestruj" component={ RegistrationLanding } />
                    <Route path="/konto/zaloguj" component={ LoginLanding } />
                    <Route path="/konto/ustawienia" component={ Settings } />
                    <Route path="/konto/aukcje/dodaj" component={ CreateUpdateAction } />
                    <Route exact path="/aukcje/:id" component={ AuctionDetails } />
                    <Route path="/konto/aukcje/dostawa" component={ Delivery } />
                </div>

                <footer>
                    <CategoryLinks />
                    <FooterBar />
                </footer>
            </div>
        </BrowserRouter>
      </div>
    );
  }
}

function mapUserStateToProps({ user }) {
    return { user };
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

export default connect(mapFlashToProps, { ...userActions, ...categoryActions, ...flashActions })(App);
