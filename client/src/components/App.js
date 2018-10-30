import React, { Component } from 'react';
import './App.css';
import { RegistrationLanding } from './Landing';

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
        
        let categories = [];
        
        for (let key in ProductCategories) {
            categories.push(key);
            categories = categories.concat(...ProductCategories[key]);
        }
        
        this.categories = categories;
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
                                    this.categories
                                        .map(category => (
                                           category in ProductCategories 
                                           ?
                                           <div className="main" onClick={this.showSubcategories}>{ category }</div>
                                           :
                                           <div className="child" style={{ display: 'none' }} onClick={this.handleCategory}>{ category }</div>

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

class UserLinks extends Component {
    render() {
        return (
            <div className="user-links">
                <a href="#">Moje aukcje</a>
                <a href="#"><i className="material-icons">account_circle</i></a>
            </div>
        );
    }
}

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
        const main_category = this.props.data;
        const data = ProductCategories[main_category];
        
        return (
            <div className="categories">
                <a href="#"><strong>{main_category}</strong></a>
                {
                    data.map(category => <a href="#">{ category }</a>)
                }
            </div>
        );
    }
}

class CategoryLinks extends Component {
    render() {
        const categories = Object.keys(ProductCategories);
        const top = categories.slice(0, 6);
        const bottom = categories.slice(6);
        
        return (
            <div className="category-links">
                <div className="row">
                    {
                        top.map(category => (
                            <div className="column">
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
                            <div className="column">
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
                <div>Właścicielem portalu jest</div>
                <div>Powered by MongoDB</div>
            </div>
        );
    }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Navi />
          <Breadcrumbs />
        </header>
        
        <div className="content" style={{ marginTop: 30 }}>
            <RegistrationLanding />
        </div>
        
        <footer>
            <CategoryLinks />
            <FooterBar />
        </footer>
      </div>
    );
  }
}

export default App;
