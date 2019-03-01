import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';

import Logo from './Logo';
import { SearchField } from './Search';
import Chat from './Chat';

class UserLinks extends Component {
    render() {
        const 
            { user, open, searchHandler, toggleMenu, callback } = this.props,
            className = "user-links" + (open ? ' open' : '');

        const 
            Search = <span className="link search-mobile" onClick={() => {searchHandler(); toggleMenu();}}><i className="material-icons">search</i></span>;
        
        if (user !== false && user !== null) {
            return (
                <div className={className}>
                    <Link to="/moje-aukcje" onClick={toggleMenu}>Moje aukcje</Link>
                    { Search }
                    <Chat socket={ this.props.socket } id={user._id} callback={callback} onClick={toggleMenu} />
                    <span className="link" onClick={toggleMenu}>
                        { user.firstname && <span className="orange navigation-welcome">{ user.firstname }</span> }
                        <img src="/assets/icons/user.png" />
                        <div className="dropdown">
                            <Link to="/konto/ustawienia" className="account">Konto</Link>
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
                    <Link to="/konto/zaloguj" onClick={toggleMenu}>Zaloguj</Link>
                    <Link to="/konto/zarejestruj" onClick={toggleMenu}>Zarejestruj się</Link>
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
        this.state = { mobile: false, search: false, chatBox: null };
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
        const { callback, categoryData, categoryCallback } = this.props;

        return (
            <nav>
                <Logo />
                <SearchField open={ search } setQuery={ this.props.setQuery } searchHandler={ this.searchHandler } categoryCallback={ categoryCallback } categoryData={ categoryData } />
                <MobileMenu open={ mobile } clickHandler={ this.clickHandler } />
                <UserLinks callback={ callback } open={ mobile } socket={ this.props.socket } searchHandler={ this.searchHandler } toggleMenu={ this.clickHandler }/>
                
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
                            <span key={"crumb_" + index}>
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

function mapUserStateToProps({ user }) {
    return { user };
}

UserLinks = connect(mapUserStateToProps)(UserLinks);
Breadcrumbs = withRouter(Breadcrumbs);

export { Navi, MobileMenu, UserLinks, Breadcrumbs };