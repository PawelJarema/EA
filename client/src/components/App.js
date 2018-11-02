import React, { Component } from 'react';
import './App.css';

import { BrowserRouter, Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as userActions from '../actions/userActions';
import * as categoryActions from '../actions/categoryActions';
import * as flashActions from '../actions/flashActions';

import { RegistrationLanding, LoginLanding } from './Landing';

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
            <div className="logo"><i className="material-icons">gavel</i>E-Aukcje</div>
        );
    }
}

class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = { category: 'Kategorie', select: false };    
        
        this.handleCategory = this.handleCategory.bind(this);
        this.openSelect = this.openSelect.bind(this);
        this.showSubcategories = this.showSubcategories.bind(this);
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
                        <input name="item" placeholder="Czego szukasz?" type="text" className="item" />
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
                    <button className="search-button">Szukaj</button>
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
                    <a href="#">
                        <i className="material-icons">account_circle</i>
                        <div className="dropdown">
                            <a href="/api/logout">Wyloguj</a>
                            <a href="/aukcje/dodaj">Dodaj Aukcję</a>
                        </div>
                    </a>
                </div>
            );
        } else if (user !== null) {
            return (
                <div className="user-links">
                    <a href="/konto/zaloguj">Zaloguj się</a>
                    <a href="/konto/zarejestruj">Zarejestruj się</a>
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
                    current_path.map(frag => <span>{ frag }</span>)
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
                        <Logo />
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

class App extends Component {
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
        
        
        <header className="App-header">
          <Navi />
          <Breadcrumbs />
          { this.props.categories }
        </header>
        
        <div className="content" style={{ marginTop: 30 }}>
            <BrowserRouter>
                <div>
                    <Route path="/konto/zarejestruj" component={ RegistrationLanding } />
                    <Route path="/konto/zaloguj" component={ LoginLanding } />
                </div>
            </BrowserRouter>
        </div>
        
        <footer>
            <CategoryLinks />
            <FooterBar />
        </footer>
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
