import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import RawImage from './RawImage';
import { ImageProgress } from '../Progress';
import PriceHelper from '../../helpers/priceHelper';
import { auctionPath } from './functions';

class Auction extends Component {
    render() {
        const { auction } = this.props;
        if (!auction)
            return null;

        const current_price = auction.price.current_price || auction.price.start_price;

        return (
            <Link to={auctionPath(auction)}>
                <div className="auction">
                    <div className="photo">
                        <ImageProgress />
                        {
                            <RawImage link={auction} />
                        }
                    </div>
                    <div className="title">
                        <h2>{auction.title}</h2>
                    </div>
                    <div className="description">
                        <p>{auction.shortdescription}</p>
                    </div>
                    <div className="price-div">
                        <span className="price">Aktualna cena: <span className="value">{ PriceHelper.write(current_price) }</span></span>
                    </div>
                </div>
            </Link>
        );
    }
}

export default Auction;