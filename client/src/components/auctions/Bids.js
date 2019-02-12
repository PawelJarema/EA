import React, { Component } from 'react';
import NameHelper from '../../helpers/nameHelper';
import PriceHelper from '../../helpers/priceHelper';

class AuctionBids extends Component {
    render() {
        const { user, auction, bidders } = this.props;
        const current_price = auction.price.current_price || auction.price.start_price;
        return (
            <div className="auction-bids">
                {  
                    auction.bids.length ? (
                        <div className="all-bids">
                            <h1><i className="material-icons">gavel</i> Stan licytacji</h1>
                            <table>
                            <tbody>
                                {
                                    auction.bids.map((bid, index) => {
                                        if (bidders[bid._user]) {
                                            return (
                                                <tr 
                                                    key={'bid_' + index} 
                                                    className={`bidder ${bidders[bid._user]._id === user._id ? 'me' : ''}`}
                                                >
                                                    <td>{ index + 1 }.</td>
                                                    <td>{bidders[bid._user]._id === user._id ? NameHelper.name(bidders[bid._user]) : NameHelper.covername(bidders[bid._user])}</td>
                                                    <td className="price">{ (index === 0 ? PriceHelper.write(current_price) : PriceHelper.write(bid.price)) }</td>
                                                </tr>
                                            );
                                        } else {
                                            return (
                                                <tr key={'bid_' + index}>
                                                    <td>{ index + 1 }</td>
                                                    <td>..............</td>
                                                    <td className="price">{ (index === 0 ? PriceHelper.write(current_price) : PriceHelper.write(bid.price)) }</td>
                                                </tr>
                                            );
                                        }
                                        
                                    })
                                }
                                </tbody>
                            </table>
                        </div>
                    ) 
                    : 
                    (
                        <div className="no-result">
                            <i className="material-icons">gavel</i>
                            <h1>{ (auction.ended ? 'Nikt nie zalicytował' : 'Nikt nie licytuje') }</h1>
                            <p>{ (auction.ended ? '' : 'Podbij stawkę minimalną i bądź pierwszy!') }</p> 
                        </div>
                    )
                }
            </div>
        )
    }
}

export default AuctionBids;