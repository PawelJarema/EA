import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Logo from './Logo';

class CategoryLink extends Component {
    constructor(props) {
        super(props);
        this.navigate = this.navigate.bind(this);
    }

    navigate(category, subcategory) {
        const { categoryCallback } = this.props;
        new Promise((resolve, reject) => {
            resolve(categoryCallback({ category, subcategory, time: new Date().getTime() }));
        }).then(this.props.navigate);


    }

    render() {
        const category = this.props.data;
        const subcategories = category.subcategories;
        
        return (
            <div className="categories">
                <a onClick={ () => this.navigate(category.name, null) }><strong >{category.name}</strong></a>
                {
                    subcategories.map(subcategory => <a key={subcategory.name} onClick={ () => this.navigate(category.name, subcategory.name) }>{ subcategory.name }</a>) //* */
                }
            </div>
        );
    }
}

class CategoryLinks extends Component {
    navigate() {
        this.props.history.push('/aukcje');
    }

    render() {
        const categories = this.props.categories;
        
        if (categories === null || categories === false)
            return null;

        const top = categories.slice(0, 6);
        const bottom = categories.slice(6);

        const { categoryCallback } = this.props;
        
        return (
            <div className="category-links">
                <div className="row">
                    {
                        top.map(category => (
                            <div key={category.name} className="column">
                                <CategoryLink data={category} categoryCallback={categoryCallback} navigate={this.navigate.bind(this)} />
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
                                <CategoryLink data={category} categoryCallback={categoryCallback} navigate={this.navigate.bind(this)}  />
                            </div>
                        ))
                    }
                </div>
            </div>
        )
    }
}

class FooterLinks extends Component {
    render() {
        return (
            <div className="footer-links">
                <Link to="/regulamin">Regulamin</Link>
                <Link to="/kontakt">Kontakt</Link>
            </div>
        );
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

function mapCategoryStateToProps({ categories }) {
    return { categories };
}


CategoryLinks = connect(mapCategoryStateToProps)(withRouter(CategoryLinks));
export { CategoryLinks, FooterLinks, FooterBar };