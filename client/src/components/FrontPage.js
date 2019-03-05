import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as auctionActions from '../actions/auctionActions';

import FrontPageCategories from './FrontPageCategories';
import Auction from './auctions/Auction';
import Progress from './Progress';

import './FrontPage.css';

class FrontPage extends Component {

    componentDidMount() {
        this.props.fetchFrontPageAuctions();
    }

    componentWillReceiveProps(props) {
        if (props.auctions) {
        }
    }

    render() {
        const { categories, categoryCallback, onMobile, windowWidth } = this.props;

        return (
            <div className="FrontPage">
                {
                    (!this.props.auctions || !this.props.auctions.popular) && <Progress />
                }
                {
                    this.props.auctions && <FrontPageCategories categoryCallback={ categoryCallback } onMobile={ onMobile } windowWidth={ windowWidth } />
                }
                {
                    this.props.auctions && this.props.auctions.popular && (
                        <div className="most-popular">
                            <h1><i className="material-icons">trending_up</i> Polecane</h1>
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
                {
                    this.props.auctions && this.props.auctions.newest && (
                        <div className="new">
                            <h1><i className="material-icons">new_releases</i> Najnowsze</h1>
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
}

function mapAuctionsStateToProps({ auctions }) {
    return { auctions };
}

FrontPage = connect(mapAuctionsStateToProps, auctionActions)(FrontPage);
export default FrontPage;