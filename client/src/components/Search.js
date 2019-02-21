import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class SearchField extends Component {
    constructor(props) {
        super(props);
        this.state = { category: 'Kategorie', query: '', select: false };    
        
        this.openSelect = this.openSelect.bind(this);
        this.showSubcategories = this.showSubcategories.bind(this);
        this.handleCategory = this.handleCategory.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.lookFor = this.lookFor.bind(this);
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
        const value = element.innerHTML === 'Wszystkie kategorie' ? 'Kategorie' : element.innerHTML;
        
        this.props.categoryCallback({ category: value === 'Kategorie' || value === 'Szukaj Sprzedawcy' ? null : value });
        this.setState({ category: value }, this.lookFor);
    }
    
    handleInput(event) {
        const input = event.target;
        const query = input.value;
        const { category } = this.state;
        
        this.props.setQuery(query);
        this.props.categoryCallback({ category: category === 'Kategorie' || category === 'Szukaj Sprzedawcy' ? null : category });
        this.setState({ query }, this.lookFor);
    }

    lookFor() {
        const history = this.props.history;

        if (this.inputTimeout) clearTimeout(this.inputTimeout);
        if (this.closeTimeout) clearTimeout(this.closeTimeout);

        this.inputTimeout = setTimeout(() => {
            history.push(`/aukcje/szukaj/${this.state.category}/${this.state.query || '*'}`);
            this.closeTimeout = setTimeout(this.props.searchHandler, 4000);
        }, 300);
    }

    render() {
        const { open, categories, searchHandler } = this.props;
        const className = "search-auctions" + (open ? ' open' : '');
        if (categories === null || categories === false)
            return null;
        
        let all_categories = [];
        
        categories.map(category => {
            all_categories.push({ type: 'main', name: category.name });
            // all_categories = all_categories.concat(category.subcategories.map(subcategory => ({ type: 'child', name: subcategory.name })));
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
                                <div className="user-search" onClick={this.handleCategory}>Szukaj Sprzedawcy</div>
                                {
                                    all_categories && all_categories
                                        .map((category, i) => (
                                           category.type === 'main' 
                                           ?
                                           <div key={'main_' + i} className="main" onClick={this.handleCategory}>{ category.name }</div>
                                           :
                                           <div key={'sub_' + i} className="child" style={{ display: 'none' }} onClick={this.handleCategory}>{ category.name }</div>

                                        ))
                                }
                                <div className="para" onClick={this.handleCategory}>Wszystkie kategorie</div>
                            </div>)
                        }
                    </span>
                </div>
            </div>
        )
    }
}

// <div>
//     <Link ref={ (e) => this.searchRef = e } onClick={this.props.searchHandler} to={`/aukcje/szukaj/${this.state.category}/${this.state.query || '*'}`}><button className="search-button">Szukaj</button></Link>
// </div>

function mapCategoryStateToProps({ categories }) {
    return { categories };
}

SearchField = connect(mapCategoryStateToProps)(withRouter(SearchField));
export { SearchField };