import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import Logo from './Logo';

import { isNotEmpty } from './auctions/functions';

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
    constructor(props) {
        super(props);
        this.state = { sections: null };
    }

    navigate() {
        this.props.history.push('/aukcje');
    }

    render() {
        const 
            { categories, categoryCallback } = this.props;
        
        if (categories === null || categories === false)
            return null;

        let sections = this.state.sections;

        if (!sections) {
            sections = [];
            let 
                index = 0,
                notEmpty = true;

            do {
                const 
                    section = categories.slice(index, index + 6);
                    notEmpty = isNotEmpty(section);

                if (notEmpty) sections.push(section);
                index += 6;
            } while(notEmpty);

            this.setState({ sections });
        }

       
        
        return (
            <div className="category-links">
                {
                    sections.map((section, i) => (
                        <div key={ 'row_' + i } className="row">
                            {
                                section.length < 6 && (
                                    <div className="column">
                                        <Logo />
                                    </div>
                                )
                            }
                            {
                                section.map((cat, i) => (
                                    <div key={ cat.name } className="column">
                                        <CategoryLink data={ cat } categoryCallback={ categoryCallback } navigate={ this.navigate.bind(this) } />
                                    </div>
                                ))
                            }
                        </div>
                    ))
                }
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