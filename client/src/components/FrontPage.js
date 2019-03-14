import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as auctionActions from '../actions/auctionActions';

import FrontPageCategories from './FrontPageCategories';
import FrontPageInner from './FrontPageInner';
import Auction from './auctions/Auction';
import Progress from './Progress';

import { isEmpty, isNotEmpty } from './auctions/functions';

import './FrontPage.css';

const modes = ['main', 'promoted', 'new'];

class FrontPage extends Component {
    constructor(props) {
        super(props);
        this.state = { mode: 'main' };

        this.toggleMode = this.toggleMode.bind(this);
    }

    componentDidMount() {
        this.props.fetchFrontPageAuctions();
    }

    componentWillReceiveProps(props) {

    }

    toggleMode(changeMode) {
        this.setState(({ mode }) => ({ mode: (mode === 'main' || mode !== changeMode ? changeMode : 'main') }));
    }

    render() {
        const
            { mode } = this.state, 
            { categories, categoryCallback, onMobile, windowWidth, user } = this.props,
            inPromoted = mode === 'promoted',
            inNew = mode === 'new',
            empty = this.props.auctions && isEmpty(this.props.auctions.popular) && isEmpty(this.props.auctions.newest);

        return (
            <div className="FrontPage">
                {
                    (!this.props.auctions || !this.props.auctions.popular) && <Progress />
                }
                {
                    this.props.auctions && <FrontPageCategories categoryCallback={ categoryCallback } onMobile={ onMobile } windowWidth={ windowWidth } />
                }
                {
                    empty && (
                        <div className="empty">
                            <p className="absolute-center">Nic tu jeszcze nie ma!<br/><a className="link clickable" href={ (user ? "/konto/aukcje/dodaj" : "/konto/zaloguj") }>Dodaj aukcję</a> i bądź pierwszy.</p> 
                        </div>
                    )
                }
                {
                    this.props.auctions && isNotEmpty(this.props.auctions.popular) && (
                        <div className="most-popular">
                            <h1 className="clickable" onClick={ () => this.toggleMode('promoted') }><i className="material-icons">trending_up</i> Promowane</h1>
                            {
                                inPromoted
                                ?
                                (
                                    <FrontPageInner mode={ mode } onMobile={ onMobile }/>
                                )
                                :
                                (
                                    <div>
                                        <div className="two-column">
                                            <div className="column">
                                                <Auction auction={this.props.auctions.popular[0]} />
                                             </div>
                                            <div className="column">
                                                <Auction auction={this.props.auctions.popular[1]} />
                                            </div>
                                        </div>
                                        <div className="six-column">
                                            {
                                                this.props.auctions.popular.slice(2).map((auction, index) => <div key={auction.title + index} className="column"><Auction auction={auction} /></div>)
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            
                        </div>
                    )
                }
                {
                    this.props.auctions && isNotEmpty(this.props.auctions.newest) && (
                        <div className="new">
                            <h1 className="clickable"  onClick={ () => this.toggleMode('new') }><i className="material-icons">new_releases</i> Najnowsze</h1>
                            {
                                inNew 
                                ?
                                (
                                    <FrontPageInner mode={ mode } onMobile={ onMobile } />
                                )
                                :
                                (
                                    <div>
                                        <div className="three-column">
                                            <div className="column">
                                                <Auction auction={this.props.auctions.newest[0]} />
                                            </div>
                                            <div className="column">
                                                <Auction auction={this.props.auctions.newest[1]} />
                                            </div>
                                            <div className="column">
                                                <Auction auction={this.props.auctions.newest[2]} />
                                            </div>
                                        </div>
                                        <div className="six-column">
                                            {
                                                this.props.auctions.newest.slice(3).map((auction, index) => <div key={auction.title + index} className="column"><Auction auction={auction} /></div>)
                                            }
                                        </div>
                                    </div>
                                )
                            }
                            
                        </div>
                    )
                }

            </div>
        )
    }
}

function mapAuctionsStateToProps({ auctions }) {
    return { auctions };
}

FrontPage = connect(mapAuctionsStateToProps, auctionActions)(FrontPage);
export default FrontPage;